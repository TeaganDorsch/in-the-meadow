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

  const seasonIntro = document.getElementById("season-intro");

  const seasonMessages = {
    winter: "It’s deep winter here. A good time to rest, plan, and begin a few things gently indoors.",
    late_winter: "Late winter is a threshold — some hardy seeds can begin now, while others are still gathering strength.",
    early_spring: "Early spring brings small openings. The soil is waking, slowly.",
    mid_spring: "Spring is properly underway now, with plenty of seeds ready to go.",
    late_spring: "Warmth is building and growth is quickening.",
    summer: "Summer sowing is about succession and keeping things going.",
    autumn:"Autumn is a time to start begging to harvest all of your hardwork"
  };

  seasonIntro.textContent =
    seasonMessages[currentSeason] || "";

  function addPlantsToSection(sectionId, plant, result) {
    const section = document.querySelector(`#${sectionId} ul`);
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${plant.name}</strong><br>
      <span>${result.message}</span>
    `;

    section.appendChild(li);
  }

  plants.forEach(plant => {
    const result = classifyPlant(plant, context);

    if (result.status === "good_now") {
      addPlantsToSection("good-now", plant, result);
    }

    if (result.status === "start_indoors") {
      addPlantsToSection("start-indoors", plant, result);
    }

    if (result.status === "wait") {
      addPlantsToSection("wait", plant, result);
    }
  });
})
