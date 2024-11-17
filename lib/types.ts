export type allSongs = {
  title: string | null;
  jacketPath: string | null;
  songId: number | null;
  chartId: number | null;
  artist: string | null;
  level: number | null;
  genre: string | null;
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
