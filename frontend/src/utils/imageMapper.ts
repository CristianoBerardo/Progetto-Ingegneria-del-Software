
interface ImageMap {
    [key: string]: string;
}
  
export function getProductImage(productName: string): string | null {
    if (!productName) return null;
      
    // Normalize product name (lowercase, remove accents, singular form)
    const normalizedName: string = productName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/\s+/g, "-"); // replace spaces with hyphens
   
    let singularName: string = normalizedName;

    const imageMap: ImageMap = {
        // Vegetables
        'asparago': '/vegetables/asparagi.jpg',
        'asparagi': '/vegetables/asparagi.jpg',
        'carota': '/vegetables/carote.jpg',
        'carote': '/vegetables/carote.jpg',
        'pomodoro': '/vegetables/pomodori-cuore-di-bue.jpg',
        'pomodori': '/vegetables/pomodori-cuore-di-bue.jpg',
        'pomodorino': '/vegetables/pomodorini.jpg',
        'pomodorini': '/vegetables/pomodorini.jpg',
        // 'cipolla': '/vegetables/cipolla.jpg',
        // 'cipolle': '/vegetables/cipolla.jpg',
        // 'patata': '/vegetables/patate.jpg',
        // 'patate': '/vegetables/patate.jpg',
        'lattuga': '/vegetables/lattuga.jpg',
        'lattuga-iceberg': '/vegetables/lattuga-iceberg.jpg',
        'lattuga-gentile': '/vegetables/lattuga-gentile.jpg',
        'lattuga-trentina': '/vegetables/lattuga-trentina.jpg',
        // 'broccolo': '/vegetables/broccoli.jpg',
        // 'broccoli': '/vegetables/broccoli.jpg',
        'zucchina': '/vegetables/zucchine.jpg',
        'zucchine': '/vegetables/zucchine.jpg',
        // 'spinacio': '/vegetables/spinaci.jpg',
        // 'spinaci': '/vegetables/spinaci.jpg',
        // 'peperone': '/vegetables/peperoni.jpg',
        // 'peperoni': '/vegetables/peperoni.jpg',
      
      // Fruits
        'mela': '/fruits/mele-gala.jpg',
        'mele': '/fruits/mele-gala.jpg',
        'mele-fuji': '/fruits/mele-fuji.jpg',
        'mele-gala': '/fruits/mele-gala.jpg',
        'mele-golden': '/fruits/mele-golden.jpg',
        'mele-granny-smith': '/fruits/mele-granny-smith.jpg',
        'mele-pink-lady': '/fruits/mele-pink-lady.jpg',
        'mele-renette': '/fruits/mele-renette.jpg',
        // 'banana': '/fruits/banana.jpg',
        // 'banane': '/fruits/banana.jpg',
        // 'arancia': '/fruits/arance.jpg',
        // 'arance': '/fruits/arance.jpg',
        'fragola': '/fruits/fragole.jpg',
        'fragole': '/fruits/fragole.jpg',
        'pera': '/fruits/pere-abate.jpg',
        'pere': '/fruits/pere-abate.jpg',
        'pere-abate': '/fruits/pere-abate.jpg',
        'pere-williams': '/fruits/pere-williams.jpg',
        'uva': '/fruits/uva.jpg',
        // 'ananas': '/fruits/ananas.jpg',
        // 'pesca': '/fruits/pesche.jpg',
        // 'pesche': '/fruits/pesche.jpg',
        // 'limone': '/fruits/limoni.jpg',
        // 'limoni': '/fruits/limoni.jpg',
        // 'kiwi': '/fruits/kiwi.jpg',
        'ciliegia': '/fruits/ciliegie.jpg',
        'ciliegie': '/fruits/ciliegie.jpg',
    };
    
    if (imageMap[normalizedName]) {
        // console.log('Found image for', productName, ':', imageMap[normalizedName]);
        return imageMap[normalizedName];
      } else if (imageMap[singularName]) {
        // console.log('Found image for singular form of', productName, ':', imageMap[singularName]);
        return imageMap[singularName];
      }      
      console.log('No image found for', productName);
      return null;
    }