ALTER TABLE mediacentre.signet
ADD CONSTRAINT unique_id UNIQUE (id);

CREATE TABLE mediacentre.favorites
(
    signet_id integer NOT NULL,
    user_id character varying NOT NULL,
    favorite boolean NOT NULL default false,
    PRIMARY KEY (signet_id, user_id, favorite)
    FOREIGN KEY (signet_id) REFERENCES Signet(id)
)

ALTER TABLE mediacentre.signet DROP COLUMN favorite;

ALTER TABLE mediacentre.favorites
    ADD CONSTRAINT uniquepkey UNIQUE (signet_id, user_id);