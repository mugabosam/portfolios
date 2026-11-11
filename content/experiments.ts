/**
 * Smaller projects listed under "Experiments" on /work. They link straight to
 * GitHub and do not get a full case study.
 */
export type Experiment = {
  title: string;
  summary: string;
  year: number;
  stack: string[];
  repo: string;
};

export const experiments: Experiment[] = [
  {
    title: "RPS Arena",
    summary:
      "Rock-paper-scissors with an opponent that learns how you play. Several prediction models compete, and a controller tunes difficulty toward a target win rate, checked by simulating thousands of rounds.",
    year: 2026,
    stack: ["Flutter", "Dart"],
    repo: "https://github.com/mugabosam/rock-paper-scissor",
  },
];
