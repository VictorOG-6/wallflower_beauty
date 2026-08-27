import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      className="w-screen h-screen relative overflow-hidden px-5 flex items-center justify-center lg:justify-start"
      style={{
        backgroundImage: "url(/images/hero-bg.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center lg:items-start gap-3 md:gap-12 text-secondary lg:pt-40">
        <div className="max-w-150 flex flex-col gap-2.5">
          <h1 className="font-roboto-mono text-primary font-medium text-center lg:text-left text-base md:text-xl">
            THE WALLFLOWERS / 01
          </h1>
          <h2 className="font-roboto-mono text-white font-medium text-center lg:text-left text-[40px] md:text-[89px] leading-13.75 md:leading-21.5">
            SET YOUR STANDARDS
          </h2>
          <p className="text-white text-center lg:text-left text-sm md:text-base">
            Clothing and cosmetics for the version of you that does not need
            explaining.
          </p>
        </div>
        <div className="flex items-center gap-5 md:gap-8">
          <Link
            href="/shop"
            className="w-43 md:w-61 h-15 md:h-18 bg-white text-black flex items-center justify-center text-base md:text-xl cursor-pointer transition-all duration-300 hover:bg-muted"
          >
            SHOP COLLECTION
          </Link>
          <Link
            href="/shade-finder"
            className="w-43 md:w-45 h-15 md:h-18 bg-transparent text-white border border-white flex items-center justify-center text-base md:text-xl cursor-pointer transition-all duration-300 hover:bg-white/40"
          >
            FIND MY SHADE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
