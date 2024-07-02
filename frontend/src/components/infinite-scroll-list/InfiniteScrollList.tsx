import { EmptyState } from "../empty-state/empty-state";
import { useNavigate } from "react-router-dom";
import { SearchCard } from "../search-card/SearchCard";
import { CardTypeEnum } from "~/core/enum/card-type.enum";
import { useCallback, useEffect, useRef, useState } from "react";
import { Resource } from "~/model/Resource.model";
import { ListCard } from "../list-card/ListCard";


interface InfiniteScrollListProps {
    allResourcesDisplayed: Resource[];
    setIsLoading: (isLoading: boolean) => void;
    setAlertText: (alertText: string) => void;
    refetchSearch: () => void;
}

export const InfiniteScrollList: React.FC<InfiniteScrollListProps> = (
    {allResourcesDisplayed, setIsLoading,
    setAlertText, refetchSearch
    }
) => {
    const navigate = useNavigate();
    const loaderRef = useRef(null);
    const [visibleResources, setVisibleResources] =
        useState<Resource[]>([]); // resources visible (load more with infinite scroll)
    const [limit, setLimit] = useState(0);

    const loadMoreResources = useCallback(() => {
        if (!allResourcesDisplayed) {
            return;
        }
        setVisibleResources((prevVisibleResources) => {
            setLimit((prevLimit) => prevLimit + 10); // add 10 items each scroll
            const prevItems = prevVisibleResources?? [];
            const allItems = allResourcesDisplayed;

            if (
            JSON.stringify(prevItems) !==
            JSON.stringify(allItems.slice(0, prevItems.length))
            ) {
            // If the displayed resources have changed
            prevVisibleResources = allResourcesDisplayed;
            }

            const newItems = [
            ...prevItems,
            ...allItems.slice(prevItems.length, prevItems.length + limit),
            ];

            return newItems;
        });
        setIsLoading(false);
    }, [allResourcesDisplayed, limit]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
          const target = entries[0];
          if (target.isIntersecting) {
            loadMoreResources();
          }
        },
        [loadMoreResources],
      ); // for infinite scroll

      useEffect(() => {
        const option = {
          root: null,
          rootMargin: "20px",
          threshold: 1.0,
        };
        const loader = loaderRef.current;
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader) observer.observe(loader);
        return () => {
          if (loader) observer.unobserve(loader);
        };
      }, [handleObserver]); // for infinite scroll
    
      useEffect(() => {
        setIsLoading(true);
        loadMoreResources();
      }, [allResourcesDisplayed, loadMoreResources]);

    return (
        <>
        {visibleResources &&
        (visibleResources.length !== 0) ? (
            <>
            <ListCard
                scrollable={false}
                type={CardTypeEnum.search}
                components={
                    visibleResources.map((searchResource: any) => (
                <SearchCard
                    searchResource={searchResource}
                    link={
                    searchResource.link ?? searchResource.url ?? "/"
                    }
                    setAlertText={setAlertText}
                    refetchSearch={refetchSearch}
                />
                ))}
                redirectLink={() => navigate("/search")} // to change
            />
            </>
        ) : (
            <EmptyState title="mediacentre.search.empty" />
        )}
        <div ref={loaderRef} />
        </>
    );
    }