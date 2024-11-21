export type Statistic = {
  creation: number;
  mc: number;
  buys: number;
  sells: number;
  mint: string;
  isFarm: boolean;
  traders: string[];
  intersection: number;
};

export type MemeStatistic = {
  intersection: number;
} & Statistic
