import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const ARROW_CLASS =
  "cursor-pointer text-primary transition-colors disabled:cursor-not-allowed disabled:text-[#D9D9D9]";

const Creators = () => {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-0 py-12 md:py-18 flex flex-col items-center lg:items-start gap-12 md:gap-15">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
          <h1 className="text-base md:text-xl text-primary font-roboto-mono font-medium">
            THE WALLFLOWER INFLUENCE
          </h1>
          <h2 className="text-[28px] md:text-[50px] text-black leading-9.5 md:leading-10.5">
            From creators to <br /> the faces we love.
          </h2>
        </div>
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            type="button"
            // onClick={() => scrollProducts(-1)}
            // disabled={!canScrollLeft}
            aria-label="View previous products"
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5 md:size-10" />
          </button>
          <div className="w-0.5 h-4 bg-[#D9D9D9]" />
          <button
            type="button"
            // onClick={() => scrollProducts(1)}
            // disabled={!canScrollRight}
            aria-label="View next products"
            className={ARROW_CLASS}
          >
            <ChevronRight className="size-5 md:size-10" />
          </button>
        </div>
      </div>
      <div className="md:h-135 w-full flex items-center justify-between gap-5 lg:gap-14.5 overflow-x-auto lg:overflow-hidden">
        <div className="h-full flex items-start">
          <div className="relative w-75 h-75 md:w-100 md:h-100 flex items-end py-4 px-5">
            <img
              src="/images/influencer-1.jpg"
              alt="Libra_aff"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <span
              className="text-2xl text-white text-shadow-md z-10"
              style={{
                textShadow: `
                2px 0 black,
                -2px 0 black,
                0 2px black,
                0 -2px black,
                1.5px 1.5px black,
                -1.5px -1.5px black,
                1.5px -1.5px black,
                -1.5px 1.5px black
              `,
              }}
            >
              @libra_aff
            </span>
          </div>
        </div>
        <div className="h-full flex items-start md:items-end">
          <div className="relative w-75 h-75 md:w-80 md:h-100 flex items-end py-4 px-5">
            <img
              src="/images/influencer-2.jpg"
              alt="Fave_szn"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <span
              className="text-2xl text-white text-shadow-md z-10"
              style={{
                textShadow: `
                2px 0 black,
                -2px 0 black,
                0 2px black,
                0 -2px black,
                1.5px 1.5px black,
                -1.5px -1.5px black,
                1.5px -1.5px black,
                -1.5px 1.5px black
              `,
              }}
            >
              @fave_szn
            </span>
          </div>
        </div>
        <div className="h-full flex items-start">
          <div className="relative w-75 h-75 md:w-80 md:h-100 flex items-end py-4 px-5">
            <img
              src="/images/influencer-3.jpg"
              alt="Bbaahhttt"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <span
              className="text-2xl text-white text-shadow-md z-10"
              style={{
                textShadow: `
                2px 0 black,
                -2px 0 black,
                0 2px black,
                0 -2px black,
                1.5px 1.5px black,
                -1.5px -1.5px black,
                1.5px -1.5px black,
                -1.5px 1.5px black
              `,
              }}
            >
              @bbaahhttt
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creators;
