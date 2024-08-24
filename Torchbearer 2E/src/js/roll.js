const abilities = ["will", "health", "nature", "resources", "circles"];
const skills = [
  "alchemist",
  "arcanist",
  "armorer",
  "cartographer",
  "commander",
  "cook",
  "criminal",
  "dungeoneer",
  "fighter",
  "haggler",
  "healer",
  "hunter",
  "laborer",
  "lore_master",
  "manipulator",
  "mentor",
  "orator",
  "pathfinder",
  "peasant",
  "persuader",
  "rider",
  "ritualist",
  "sapper",
  "scavenger",
  "scholar",
  "scout",
  "survivalist",
  "theologian",
];
const rollableItems = abilities.concat(...skills);

rollableItems.forEach(button => {
  on(`clicked:${button}`, function () {
    rollableItemClicked(button);
  });
});

function rollableItemClicked(button) {
  const attrsToGet = [
    button,
    "trait1_name",
    "trait2_name",
    "trait3_name",
    "trait4_name",
    "wise1_name",
    "wise2_name",
    "wise3_name",
    "wise4_name",
    "rolling_trait"
  ];

  getAttrs(attrsToGet, function (values) {
    const beginnersLuckRoll = calculateBeginnersLuck(button);

    populateTraitOptions(values);
    populateWiseOptions(values);

    setAttrs({
      rolling: button,
      tab: "roll",
      beginners_luck_roll: beginnersLuckRoll,
      rolling_dice: values[button],
    });
  });
}

function calculateBeginnersLuck(button) {
  let beginnersLuckRoll = false;
  if (skills.includes(button) && !(values[button] > 0)) {
    beginnersLuckRoll = true;
  }
  return beginnersLuckRoll;
}

function populateTraitOptions(values) {
  const options = [
    { label: "No trait", value: 0 },
  ];

  for (let i = 1; i <= 4; i++) {
    if (values["trait" + i + "_name"]) {
      const res = { label: values["trait" + i + "_name"], value: i };

      if (values["rolling_trait"] == i) {
        res.selected = true;
      }

      options.push(res);
    }
  }

  populateListOptions({
    elemSelector: '.sheet-trait-selector',
    optionsArray: options
  });
}

function populateWiseOptions(values) {
  // Deeper understanding
  const duOptions = [
    { label: "No wise", value: 0 },
  ];

  for (let i = 1; i <= 4; i++) {
    if (values["wise" + i + "_name"]) {
      const res = { label: values["wise" + i + "_name"], value: i };

      if (values["rolling_du_wise"] == i) {
        res.selected = true;
      }

      duOptions.push(res);
    }
  }

  populateListOptions({
    elemSelector: '.sheet-du-wise-selector',
    optionsArray: duOptions
  });

  // Of course
  const ocOptions = [
    { label: "No wise", value: 0 },
  ];

  for (let i = 1; i <= 4; i++) {
    if (values["wise" + i + "_name"]) {
      const res = { label: values["wise" + i + "_name"], value: i };

      if (values["rolling_du_wise"] == i) {
        res.selected = true;
      }

      ocOptions.push(res);
    }
  }

  populateListOptions({
    elemSelector: '.sheet-oc-wise-selector',
    optionsArray: ocOptions
  });
}
