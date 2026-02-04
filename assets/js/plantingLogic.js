export const RECOMMENDATION = {
  GOOD_NOW: "good_now",
  START_INDOORS: "start_indoors",
  WAIT: "wait"
};

export function isSeasonInRange(currentSeason, startSeason, endSeason) {
  const order = [
    "winter",
    "late_winter",
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
    return {
      status: RECOMMENDATION.WAIT,
      message: "This one prefers a little more warmth and will be happier later."
    };
  }

  // 2. Frost-sensitive plants in winter
  if (
    context.season === "winter" &&
    !rules.frost_tolerant
  ) {
    return {
      status: RECOMMENDATION.START_INDOORS,
      message: "This one likes a gentle start indoors espeically if it's still wintery outside."
    };
  }

  // 3. Default case
  return {
    status: RECOMMENDATION.GOOD_NOW,
    message: "This is a perfect time to start planting these outdoors."
  };
}
