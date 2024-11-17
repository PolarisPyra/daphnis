export type allSongs = {
  songId: number;
  title: string;
  artist: string;
  level: number;
  chartId: number;
  jacketPath: string;
};

export type userRatingBaseList = {
  title: string;
  artist: string;
  genre: string;
  chartId: string | number;
  level: string | number;
  jacketPath: string;
  rating: number;
  version: number;
  index: number;
  musicId: number | null;
  difficultId: number | null;
  score: number | null;
};
