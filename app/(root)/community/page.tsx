import React from "react";
import WeeklyWinner from "@/components/pages/community/weekly-winner";
import CTA from "@/components/pages/community/cta";
import Creators from "@/components/pages/community/creators";
import ResultArchive from "@/components/pages/community/result-archive";

const Community = () => {
  return (
    <main className="pt-20 md:pt-28">
      <WeeklyWinner />
      <CTA />
      <Creators />
      <ResultArchive />
    </main>
  );
};

export default Community;
