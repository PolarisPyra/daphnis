export const getDifficultyClass = (level: number) => {
  switch (level) {
    case 0:
      return "bg-green-500"; // Green for basic
    case 1:
      return "bg-yellow-500"; // Yellow for advance
    case 2:
      return "bg-red-500"; // Red for expert
    case 3:
      return "bg-purple-500"; // Purple for master
    case 4:
      return "bg-yellow-500"; // Example of gradient background
    case 5:
      return "bg-black"; // Black for worlds end
    default:
      return "bg-gray-500"; // Default to gray background for unknown difficulty
  }
};

export const getDifficultyText = (chartId: number | null) => {
  switch (chartId) {
    case 0:
      return "EASY";
    case 1:
      return "ADVANCE";
    case 2:
      return "EXPERT";
    case 3:
      return "MASTER";
    case 4:
      return "ULTIMA";
    case 5:
      return "WORLDS END";
    default:
      return ""; // Default text if chartId doesn't match any case
  }
};

export const getGrade = (score: number) => {
  if (score >= 1009000) return "SSS+";
  if (score >= 1007500 && score <= 1008999) return "SSS";
  if (score >= 1005000 && score <= 1007499) return "SS+";
  if (score >= 1000000 && score <= 1004999) return "SS";
  if (score >= 990000 && score <= 999999) return "S+";
  if (score >= 975000 && score <= 990000) return "S";
  if (score >= 950000 && score <= 974999) return "AAA";
  if (score >= 925000 && score <= 949999) return "AA";
  if (score >= 900000 && score <= 924999) return "A";
  if (score >= 800000 && score <= 899999) return "BBB";
  if (score >= 700000 && score <= 799999) return "BB";
  if (score >= 600000 && score <= 699999) return "B";
  if (score >= 500000 && score <= 599999) return "C";
  if (score < 500000) return "D";
  return "";
};
