import Link from "next/link";
import React from "react";

const Exclusive = () => {
  return (
    <section className="px-5 lg:px-0 py-12 md:py-18">
      <div className="relative max-w-7xl w-full h-221 md:h-320 lg:h-159.5 mx-auto lg:pr-22 flex pb-8 items-end justify-center lg:items-end lg:justify-end overflow-hidden">
        <img
          src="/images/exclusive.avif"
          alt="Wallflower Top Collection"
          className="hidden lg:block absolute top-0 left-0 w-full object-cover"
        />
        <img
          src="/images/exclusive-mobile.avif"
          alt="Wallflower Top Collection"
          className="block lg:hidden absolute top-0 left-0 w-full h-full md:h-auto object-cover"
        />
        <div className="z-10 bg-white flex flex-col items-center gap-2.5 text-center px-8.5 md:px-6 pt-4 md:pt-6 pb-3 lg:mr-45">
          <h1 className="underline text-primary text-base md:text-xl font-roboto-mono font-medium">
            WALLFLOWER TANK TOP
          </h1>
          <img
            src="/images/transparent-pink-tank.avif"
            alt="Pink Tank"
            className="w-33 h-50 md:w-36 md:h-54 object-cover"
          />
          <Link
            href="/shop"
            className="w-48 h-10 bg-primary text-white text-base md:text-xl font-semibold flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#F35C97]"
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Exclusive;
