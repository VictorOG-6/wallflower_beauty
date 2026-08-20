import React from "react";
import CEO from "@/components/pages/about/ceo";
import BeautyClub from "@/components/pages/about/beauty-club";
import Backstory from "@/components/pages/about/backstory";
import ShadeSpectrum from "@/components/pages/about/shade-spectrum";

const About = () => {
  return (
    <main className="pt-20 md:pt-28 bg-white">
      <CEO />
      <BeautyClub />
      <Backstory />
      <ShadeSpectrum />
    </main>
  );
};

export default About;
