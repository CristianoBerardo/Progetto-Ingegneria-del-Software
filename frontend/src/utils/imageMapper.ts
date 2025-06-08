interface ImageMap {
  [key: string]: string;
}

export function getProductImage(productName: string): string | null {
  if (!productName) return null;

  // Normalize product name (lowercase, remove accents, singular form)
  const normalizedName: string = productName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-"); // replace spaces with hyphens

  let singularName: string = normalizedName;

  const imageMap: ImageMap = {
    // Vegetables
    "asparag*": "/vegetables/asparagi.jpg",
    "carot*": "/vegetables/carote.jpg",
    "pomodorini*": "/vegetables/pomodorini.jpg", // Wildcard for all pomodorini varieties
    "pomodor*": "/vegetables/pomodori-cuore-di-bue.jpg",
    "lattuga*": "/vegetables/lattuga.jpg",
    "zucchin*": "/vegetables/zucchine.jpg",

    // Fruits
    "albicoc*": "/fruits/albicocca.png",
    "mele-fuji*": "/fruits/mele-fuji.jpg",
    "mele-gala*": "/fruits/mele-gala.jpg",
    "mele-golden*": "/fruits/mele-golden.jpg",
    "mele-granny*": "/fruits/mele-granny-smith.jpg",
    "mele-pink*": "/fruits/mele-pink-lady.jpg",
    "mele-renette*": "/fruits/mele-renette.jpg",
    "mel*": "/fruits/mele-gala.jpg",
    "fragol*": "/fruits/fragole.jpg",
    "pere-abate*": "/fruits/pere-abate.jpg",
    "pere-williams*": "/fruits/pere-williams.jpg",
    "per*": "/fruits/pere-abate.jpg",
    "uva*": "/fruits/uva.jpg",
    "cilieg*": "/fruits/ciliegie.jpg",
    "fich*": "/fruits/fichi.png",
    "mirtill*": "/fruits/mirtilli.png",
    "pesch*": "/fruits/pesca.png",
  };

  // First try exact match
  if (imageMap[normalizedName]) {
    return imageMap[normalizedName];
  }
  // Then try singular form
  else if (imageMap[singularName]) {
    return imageMap[singularName];
  }
  // Then try wildcard matching
  else {
    // Check for wildcard matches
    for (const pattern in imageMap) {
      if (pattern.endsWith("*")) {
        const prefix = pattern.slice(0, -1); // Remove the * character
        if (normalizedName.startsWith(prefix)) {
          return imageMap[pattern];
        }
      }
    }
  }

  console.log("No image found for", productName);
  return null;
}
