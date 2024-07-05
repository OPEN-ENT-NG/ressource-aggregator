import React from "react";

import { LoadingScreen } from "@edifice-ui/react";
import FlagIcon from "@mui/icons-material/Flag";
import ArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { useTranslation } from "react-i18next";

import { PinsCarouselCard } from "./pins-carousel-card/PinsCarouselCard";
import "@splidejs/react-splide/css";
import "./PinsCarousel.scss";
import { PinResource } from "~/model/PinResource.model";

interface PinsCarouselProps {
  pins: PinResource[];
}

export const PinsCarousel: React.FC<PinsCarouselProps> = ({ pins }) => {
  const { t } = useTranslation();
  if (!pins) {
    return <LoadingScreen />;
  }
  return (
    <div className="med-carousel">
      <div className="title">
        <FlagIcon className="icon" />
        <span>{t("mediacentre.pins.carousel.title")}</span>
      </div>
      <Splide
        aria-label="med-carousel"
        hasTrack={false}
        options={{
          perPage: 4,
          arrows: pins.length > 4,
          gap: "20px",
          height: "250px",
          breakpoints: {
            768: {
              perPage: 3,
              arrows: pins.length > 3,
            },
            576: {
              perPage: 2,
              arrows: pins.length > 2,
            },
            400: {
              perPage: 1,
              arrows: pins.length > 1,
            },
          },
        }}
      >
        <SplideTrack className="med-splide-track">
          {pins.map((pin, index) => (
            <SplideSlide key={index}>
              <PinsCarouselCard pin={pin} />
            </SplideSlide>
          ))}
          {/* <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide>
          <SplideSlide>
            <PinsCarouselCard />
          </SplideSlide> */}
        </SplideTrack>

        <div className="splide__arrows">
          <ArrowLeftIcon
            role="button"
            className="splide__arrow splide__arrow--prev med-carousel-arrow"
          />
          <ArrowRightIcon
            role="button"
            className="splide__arrow splide__arrow--next med-carousel-arrow"
          />
        </div>

        <div className="splide__pagination med-pagination"></div>
      </Splide>
    </div>
  );
};
