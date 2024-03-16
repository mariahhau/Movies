import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  stats: Statistic | null;
}

export interface Statistic {
  calls: number;
  time: number;
}

function Statistics({ stats }: Props) {
  return (
    <>
      {stats
        ? ` ${new Date(stats?.time).toLocaleString()} | API Requests: [${
            stats?.calls
          }/100]`
        : ""}
    </>
  );
}

export default Statistics;
