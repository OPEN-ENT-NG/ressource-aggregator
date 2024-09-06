/*
 * Copyright © "Open Digital Education", 2018
 *
 * This program is published by "Open Digital Education".
 * You must indicate the name of the software and the company in any production /contribution
 * using the software and indicate on the home page of the software industry in question,
 * "powered by Open Digital Education" with a reference to the website: https://opendigitaleducation.com/.
 *
 * This program is free software, licensed under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, version 3 of the License.
 *
 * You can redistribute this application and/or modify it since you respect the terms of the GNU Affero General Public License.
 * If you modify the source code and then use this modified source code in your creation, you must make available the source code of your modifications.
 *
 * You should have received a copy of the GNU Affero General Public License along with the software.
 * If not, please see : <http://www.gnu.org/licenses/>. Full compliance requires reading the terms of this license and following its directives.

 */

package fr.openent.mediacentre.helper.elasticsearch;

import com.fasterxml.jackson.databind.util.JSONPObject;
import fr.wseduc.webutils.DefaultAsyncResult;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.http.*;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.core.net.ProxyOptions;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class ElasticSearch {

	private static class ElasticSearchClient {

		private final int index;
		private final HttpClient client;
		private AtomicInteger errorsCount = new AtomicInteger(0);

		private ElasticSearchClient(int index, HttpClient client) {
			this.index = index;
			this.client = client;
		}

		private boolean checkError() {
			return errorsCount.incrementAndGet() > 3;
		}

		private void checkSuccess() {
			if (errorsCount.get() > 0) {
				errorsCount.set(0);
			}
		}
	}

	private static final Logger log = LoggerFactory.getLogger(ElasticSearch.class);
	private ElasticSearchClient[] clients;
	private final CopyOnWriteArrayList<Integer> availableNodes = new CopyOnWriteArrayList<>();
	private final Random rnd = new Random();
	private String defaultIndex;
	private String username = null;
	private String password = null;
	private Vertx vertx;

	private ElasticSearch() {}

	private static class ElasticSearchHolder {
		private static final ElasticSearch instance = new ElasticSearch();
	}

	public static ElasticSearch getInstance() {
		return ElasticSearchHolder.instance;
	}

	public void init(Vertx vertx, JsonObject elasticsearchConfig) {
		this.vertx = vertx;
		JsonArray serverUris = elasticsearchConfig.getJsonArray("server-uris");
		String serverUri = elasticsearchConfig.getString("server-uri");
		if (serverUris == null && serverUri != null) {
			serverUris = new fr.wseduc.webutils.collections.JsonArray().add(serverUri);
		}

		if (serverUris != null) {
			try {
				URI[] uris = new URI[serverUris.size()];
				for (int i = 0; i < serverUris.size(); i++) {
					uris[i] = new URI(serverUris.getString(i));
				}
				init(uris, vertx,
						elasticsearchConfig.getInteger("poolSize", 16),
						elasticsearchConfig.getBoolean("keepAlive", true),
						elasticsearchConfig);
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
		} else {
			log.error("Invalid ElasticSearch URI");
		}
	}

	public void init(URI[] uris, Vertx vertx, int poolSize, boolean keepAlive, JsonObject elasticsearchConfig) {
		defaultIndex = elasticsearchConfig.getString("index");
		username = elasticsearchConfig.getString("username", null);
		password = elasticsearchConfig.getString("password", null);
		Boolean elasticSearchSSL = elasticsearchConfig.getBoolean("elasticsearch-ssl", false);
		clients = new ElasticSearchClient[uris.length];
		for (int i = 0; i < uris.length; i++) {
			HttpClientOptions httpClientOptions = new HttpClientOptions()
					.setKeepAlive(keepAlive)
					.setMaxPoolSize(poolSize)
					.setDefaultHost(uris[i].getHost())
					.setDefaultPort(uris[i].getPort())
					.setConnectTimeout(20000)
					.setSsl(elasticSearchSSL);
			if (System.getProperty("httpclient.proxyHost") != null) {
				ProxyOptions proxyOptions = new ProxyOptions()
						.setHost(System.getProperty("httpclient.proxyHost"))
						.setPort(Integer.parseInt(System.getProperty("httpclient.proxyPort")))
						.setUsername(System.getProperty("httpclient.proxyUsername"))
						.setPassword(System.getProperty("httpclient.proxyPassword"));
				httpClientOptions.setProxyOptions(proxyOptions);
			}
			clients[i] = new ElasticSearchClient(i, vertx.createHttpClient(httpClientOptions));
			availableNodes.addIfAbsent(i);
		}
	}

	public void search(String type, JsonObject query, Handler<AsyncResult<JsonObject>> handler) {
		this.postInternal(this.defaultIndex + "/" + type + "/_search", 200, query, handler);
	}

	public void post(String type, JsonObject object, Handler<AsyncResult<JsonObject>> handler) {
		this.postInternal(this.defaultIndex + "/" + type, 201, object, handler);
	}

	public void create(String type, JsonObject object, Integer id, Handler<AsyncResult<JsonObject>> handler) {
		this.postInternal(this.defaultIndex + "/" + type + "/" + id, 201, object, handler);
	}

	public void delete(JsonObject object, Handler<AsyncResult<JsonObject>> handler) {
		this.postInternal(this.defaultIndex + "/_delete_by_query", 200, object, handler);
	}

	public void update(JsonObject object, Integer id, Handler<AsyncResult<JsonObject>> handler) {
		this.postInternal(this.defaultIndex + "/_update/" + id, 200, object, handler);
	}

	private void postInternal(String path, int expectedStatus, JsonObject payload, Handler<AsyncResult<JsonObject>> handler) {
		final ElasticSearchClient esc = getClient();


		RequestOptions requestOptions = new RequestOptions()
				.setURI(path)
				.putHeader("Content-Type", "application/json")
				.putHeader("Accept", "application/json; charset=UTF-8")
				.setMethod(HttpMethod.POST);

		if (this.username != null && this.password != null && !this.username.isEmpty() && !this.password.isEmpty()) {
			String credentials = this.username + ":" + this.password;
			requestOptions.putHeader("Authorization", "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes()));
		}

		esc.client.request(requestOptions)
				.flatMap(httpClientRequest -> httpClientRequest.send(payload.encode()))
				.onSuccess(request -> {
					if (request.statusCode() == expectedStatus) {
						request.bodyHandler(respBody -> handler.handle(new DefaultAsyncResult<>(new JsonObject(respBody))));
					} else {
						handler.handle(new DefaultAsyncResult<>(new ElasticSearchException(request.statusMessage())));
					}
					esc.checkSuccess();
				})
				.onFailure(e -> {
					checkDisableClientAfterError(esc, e);
					handler.handle(Future.failedFuture(e));
				});




	}

	public BulkRequest bulk(String type, Handler<AsyncResult<JsonObject>> handler) {
		final ElasticSearchClient esc = getClient();

		String url = defaultIndex + "/" + type + "/_bulk";

		RequestOptions requestOptions = new RequestOptions()
				.setAbsoluteURI(url)
				.putHeader("Content-Type", "application/x-ndjson")
				.putHeader("Accept", "application/json; charset=UTF-8")
				.setMethod(HttpMethod.POST);


		final Future<HttpClientRequest> reqFuture = esc.client.request(requestOptions)
				.onSuccess(request -> request.setChunked(true).send()
                        .onSuccess(event -> {
                            if (event.statusCode() == 200) {
                                event.bodyHandler(respBody -> handler.handle(new DefaultAsyncResult<>(new JsonObject(respBody))));
                            } else {
                                handler.handle(new DefaultAsyncResult<>(new ElasticSearchException(event.statusMessage())));
                            }
                            esc.checkSuccess();
                        })
                        .onFailure(e -> checkDisableClientAfterError(esc, e)))
				.onFailure(e -> checkDisableClientAfterError(esc, e));

		return new BulkRequest(reqFuture.result());
	}

	private void checkDisableClientAfterError(ElasticSearchClient esc, Throwable e) {
		log.error("Error with ElasticSearchClient : " + esc.index, e);
		if (esc.checkError()) {
			availableNodes.remove(Integer.valueOf(esc.index));
			vertx.setTimer(60000L, h -> availableNodes.addIfAbsent(esc.index));
		}
	}

	private ElasticSearchClient getClient() {
		return clients[rnd.nextInt(availableNodes.size())];
	}

}
