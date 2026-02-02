export const RECOMMENDATION = {
  GOOD_NOW: "good_now",
  START_INDOORS: "start_indoors",
  WAIT: "wait"
};

export function isSeasonInRange(currentSeason, startSeason, endSeason) {
  const order = [
    "winter",
    "early_spring",
    "mid_spring",
    "late_spring",
    "summer",
    "autumn"
  ];

  const currentIndex = order.indexOf(currentSeason);
  return (
    currentIndex >= order.indexOf(startSeason) &&
    currentIndex <= order.indexOf(endSeason)
  );
}

export function classifyPlant(plant, context) {
  const rules = plant.rules;

  // 1. Outside seasonal window
  if (
    !isSeasonInRange(
      context.season,
      rules.season_start,
      rules.season_end
    )
  ) {
    return RECOMMENDATION.WAIT;
  }

  // 2. Frost-sensitive plants in winter
  if (
    context.season === "winter" &&
    !rules.frost_tolerant
  ) {
    return RECOMMENDATION.START_INDOORS;
  }

  // 3. Default case
  return RECOMMENDATION.GOOD_NOW
}
