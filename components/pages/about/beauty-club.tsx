import React from "react";

const BeautyClub = () => {
  return (
    <section className="py-7 md:py-9 px-5 lg:px-0">
      <div className="max-w-7xl mx-auto bg-foreground flex flex-col lg:flex-row items-center justify-between gap-17 lg:gap-0 py-6 lg:py-9 px-0 lg:px-14">
        <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
          <h1 className="text-primary font-roboto-mono font-medium text-base md:text-xl">
            THE POP-UP SHOP
          </h1>
          <h2 className="text-black text-[28px] md:text-[38px] leading-8 md:leading-10.5">
            Wallflower <br /> Beauty Club
          </h2>
          <p className="max-w-77 lg:max-w-117 text-tertiary text-sm md:text-base">
            Join us for the experience to try Wallflower Beauty products IRL and
            stock up on your favourite Wallflower Beauty Essentials
          </p>
        </div>
        <img
          src="/images/beauty-club.avif"
          alt="Wallflower Beauty Club"
          className="w-72.5 h-40.5 md:w-94.5 md:h-53.5 object-cover rounded-[15px]"
        />
      </div>
    </section>
  );
};

export default BeautyClub;
