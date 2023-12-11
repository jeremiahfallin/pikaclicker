const gyms = [
  {
    town: "Home",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Moon Stone",
        slug: "moon-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Leaf Stone",
        slug: "leaf-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Gracidea",
        slug: "gracidea",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Dragon Scale",
        slug: "dragon-scale",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Volcano Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Fire Stone",
        slug: "fire-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Auspicious Armor",
        slug: "auspicious-armor",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Malicious Armor",
        slug: "malicious-armor",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Oval Stone",
        slug: "oval-stone",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Swamp Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Reaper Cloth",
        slug: "reaper-cloth",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Link Cable",
        slug: "link-cable",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Prism Scale",
        slug: "prism-scale",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Rock Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Protector",
        slug: "protector",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Black Augurite",
        slug: "black-augurite",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Metal Coat",
        slug: "metal-coat",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Electric Town",
    items: [
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
      {
        name: "Thunder Stone",
        slug: "thunder-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Up-Grade",
        slug: "up-grade",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Dubious Disc",
        slug: "dubious-disc",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Desert Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
      {
        name: "Dusk Stone",
        slug: "dusk-stone",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Flying Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
      {
        name: "Sun Stone",
        slug: "sun-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Shiny Stone",
        slug: "shiny-stone",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Ice Town",
    items: [
      {
        name: "Pokeball",
        price: 100,
        type: "ball",
      },
      {
        name: "Great Ball",
        price: 200,
        type: "ball",
      },
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
      {
        name: "Ice Stone",
        slug: "ice-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Galarica Cuff",
        slug: "galarica-cuff",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Galarica Wreath",
        slug: "galarica-wreath",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Fossil Town",
    items: [
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
      {
        name: "Water Stone",
        slug: "water-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Dawn Stone",
        slug: "dawn-stone",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "King's Rock",
        slug: "kings-rock",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Tart Apple",
        slug: "tart-apple",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Sweet Apple",
        slug: "sweet-apple",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Syrupy Apple",
        slug: "syrupy-apple",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Teal Mask",
        slug: "teal-mask",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Wellspring Mask",
        slug: "wellspring-mask",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Hearthflame Mask",
        slug: "hearthflame-mask",
        price: 10000,
        type: "evolution-item",
      },
      {
        name: "Cornerstone Mask",
        slug: "cornerstone-mask",
        price: 10000,
        type: "evolution-item",
      },
    ],
  },
  {
    town: "Elite 4",
    items: [
      {
        name: "Ultra Ball",
        price: 1000,
        type: "ball",
      },
    ],
  },
];

export default gyms;
