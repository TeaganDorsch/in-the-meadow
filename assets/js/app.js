import { classifyPlant } from "./plantingLogic.js";

function getSeasonFromOffset(daysFromLastFrost, seasons) {
  for (const key in seasons) {
    const season = seasons[key];

    if (
      daysFromLastFrost >= season.start_offset_days &&
      daysFromLastFrost <= season.end_offset_days
    ) {
      return key;
    }
  }
  return null;
}

Promise.all([
  fetch("data/plants.yaml").then(r => r.text()),
  fetch("data/regions.yaml").then(r => r.text()),
  fetch("data/seasons.yaml").then(r => r.text())
])
.then(([plantsText, regionsText, seasonsText]) => {
  const plants = jsyaml.load(plantsText);
  const regions = jsyaml.load(regionsText);
  const seasons = jsyaml.load(seasonsText);

  console.log("Plants:", plants);
  console.log("Regions:", regions);
  console.log("Seasons:", seasons);

  const region = regions.find(r => r.id === "north_west_england");
  console.log("Region in use:", region);

  const today = new Date();
  const lastFrost = new Date(region.avg_last_frost);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromLastFrost = Math.floor(
    (today - lastFrost) / msPerDay
  );

  console.log("Days from last frost:", daysFromLastFrost)

  const currentSeason = getSeasonFromOffset(
    daysFromLastFrost,
    seasons
  );

  console.log("Current season:", currentSeason);

  const context = {
  season: currentSeason
  };

  plants.forEach(plant => {
    const result = classifyPlant(plant, context);
    console.log(
      plant.name,
      "→",
      result.status,
      "|",
      result.message
    );
  });
})
