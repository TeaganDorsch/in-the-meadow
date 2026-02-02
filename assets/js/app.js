fetch("data/plants.yaml")
  .then(response => response.text())
  .then(text=> {
    const plants = jsyaml.load(text);
    console.log(plants);

    plants.forEach(plant => {
      console.log(plant.name);
    });
  })
