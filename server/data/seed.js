const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Noir Absolu',
    brand: 'Maison Lumière',
    tagline: 'The darkness that seduces',
    description: 'A bold oud-leather accord wrapped in midnight rose and smoky incense.',
    fullDescription:
      'Noir Absolu is an ode to dusk — the precise moment the sky surrenders its last blue. A dense opening of smoked leather and oud resin gives way to a heart of Taif rose and black pepper, settling into a base of labdanum, vetiver, and skin-warm musks. Wear it when the evening deserves a signature.',
    price: 4200,
    originalPrice: 5500,
    category: 'Oriental',
    gender: 'Unisex',
    concentration: 'Extrait de Parfum',
    sizes: [
      { ml: 30, price: 2800, inStock: true },
      { ml: 50, price: 4200, inStock: true },
      { ml: 100, price: 6800, inStock: false },
    ],
    images: [
      '/images/bottle1.jpg',
      '/images/bottle2.jpg',
      '/images/bottle3.jpg',
      '/images/bottle4.jpg',
    ],
    thumbnailImage: '/images/bottle1.jpg',
    notes: {
      top: ['Smoked Leather', 'Black Pepper', 'Saffron'],
      heart: ['Taif Rose', 'Oud Resin', 'Incense'],
      base: ['Labdanum', 'Vetiver', 'Skin Musk'],
    },
    rating: 4.8,
    reviewCount: 3,
    badge: 'Bestseller',
    featured: true,
    reviews: [
      {
        user: 'Aryan M.',
        rating: 5,
        title: 'Absolutely magnetic',
        body: 'I wore this to a dinner and got three compliments before the appetisers arrived. The dry-down is pure luxury — smoky yet intimate.',
        date: new Date('2025-11-10'),
      },
      {
        user: 'Priya S.',
        rating: 5,
        title: 'Worth every rupee',
        body: 'The sillage is extraordinary. I sprayed once in the morning and could still smell it on my scarf at midnight.',
        date: new Date('2025-10-22'),
      },
      {
        user: 'Rohan K.',
        rating: 4,
        title: 'Powerful opening, beautiful finish',
        body: 'The first hour is intense — almost too much — but the drydown into vetiver and musk is stunning. Give it time.',
        date: new Date('2025-09-15'),
      },
    ],
  },
  {
    name: 'Alba Bianca',
    brand: 'Maison Lumière',
    tagline: 'Light before the world wakes',
    description: 'White florals lifted by yuzu and morning dew on sun-warmed sandalwood.',
    fullDescription:
      'Alba Bianca captures the sensory silence of dawn: dew on gardenias, soft citrus light, and sandalwood warming beneath a winter sun. The accord is simultaneously clean and complex — a floral that refuses to be sweet, carried on a base of white musks and cedarwood that lingers like a memory of good weather.',
    price: 3600,
    originalPrice: null,
    category: 'Floral',
    gender: 'Women',
    concentration: 'Eau de Parfum',
    sizes: [
      { ml: 30, price: 2200, inStock: true },
      { ml: 50, price: 3600, inStock: true },
      { ml: 100, price: 5500, inStock: true },
    ],
    images: [
      '/images/bottle2.jpg',
      '/images/bottle3.jpg',
      '/images/bottle4.jpg',
      '/images/bottle5.jpg',
    ],
    thumbnailImage: '/images/bottle2.jpg',
    notes: {
      top: ['Yuzu', 'Green Tea', 'Bergamot'],
      heart: ['Gardenia', 'Jasmine Sambac', 'Peony'],
      base: ['Sandalwood', 'White Musk', 'Cedarwood'],
    },
    rating: 4.6,
    reviewCount: 2,
    badge: 'New',
    featured: true,
    reviews: [
      {
        user: 'Sneha R.',
        rating: 5,
        title: 'My everyday scent',
        body: 'Effortless and elegant. It smells expensive without shouting. Perfect for the office and transitions beautifully into evening.',
        date: new Date('2025-12-01'),
      },
      {
        user: 'Meera T.',
        rating: 4,
        title: 'Genuinely unique floral',
        body: 'Not your average floral — the green tea note keeps it fresh and a little unusual. Great projection for the first few hours.',
        date: new Date('2025-11-18'),
      },
    ],
  },
  {
    name: 'Forêt Sauvage',
    brand: 'Maison Lumière',
    tagline: 'Earth, bark, and solitude',
    description: 'Moss-covered pine and cold rain over dark patchouli and amber resin.',
    fullDescription:
      'Forêt Sauvage is a walk into a forest after heavy rain — the smell of wet bark, crushed pine needles, and cold air. A fougère skeleton built on oakmoss and lavender is given real depth by dark patchouli, amber resin, and a background note of smoked birch tar that makes this feel ancient and deliberate.',
    price: 3900,
    originalPrice: 4800,
    category: 'Woody',
    gender: 'Men',
    concentration: 'Eau de Parfum',
    sizes: [
      { ml: 50, price: 3900, inStock: true },
      { ml: 100, price: 5900, inStock: true },
    ],
    images: [
      '/images/bottle3.jpg',
      '/images/bottle4.jpg',
      '/images/bottle5.jpg',
      '/images/bottle6.jpg',
    ],
    thumbnailImage: '/images/bottle3.jpg',
    notes: {
      top: ['Pine Needle', 'Juniper Berry', 'Cardamom'],
      heart: ['Oakmoss', 'Lavender', 'Geranium'],
      base: ['Dark Patchouli', 'Amber Resin', 'Birch Tar'],
    },
    rating: 4.7,
    reviewCount: 2,
    badge: null,
    featured: true,
    reviews: [
      {
        user: 'Vikram L.',
        rating: 5,
        title: 'Nothing else smells like this',
        body: 'Bought on impulse, now it is my most-complimented scent. The patchouli-amber base is hypnotic — deep and warm without being heavy.',
        date: new Date('2025-10-05'),
      },
      {
        user: 'Dev P.',
        rating: 4,
        title: 'Cold-weather masterpiece',
        body: 'Feels made for Delhi winters. Projection is just right — strong enough to be noticed, not so strong it fills a room.',
        date: new Date('2025-09-29'),
      },
    ],
  },
  {
    name: 'Ambre Soleil',
    brand: 'Maison Lumière',
    tagline: 'Warm skin, golden hour',
    description: 'Tonka bean and benzoin over neroli and a whisper of saffron and honey.',
    fullDescription:
      'Ambre Soleil is the fragrance equivalent of lying in late-afternoon sun — warm, golden, and completely at ease. Neroli and bergamot provide a sparkling lift before the heart settles into the softest possible amber: tonka bean, benzoin, and honey, with a trace of saffron that adds depth without heaviness. A comfort scent of rare sophistication.',
    price: 3200,
    originalPrice: null,
    category: 'Oriental',
    gender: 'Unisex',
    concentration: 'Eau de Toilette',
    sizes: [
      { ml: 30, price: 2000, inStock: true },
      { ml: 50, price: 3200, inStock: true },
      { ml: 100, price: 4800, inStock: true },
    ],
    images: [
      '/images/bottle4.jpg',
      '/images/bottle5.jpg',
      '/images/bottle6.jpg',
      '/images/bottle7.jpg',
    ],
    thumbnailImage: '/images/bottle4.jpg',
    notes: {
      top: ['Neroli', 'Bergamot', 'Pink Pepper'],
      heart: ['Tonka Bean', 'Saffron', 'Honey'],
      base: ['Benzoin', 'Vanilla', 'White Musk'],
    },
    rating: 4.9,
    reviewCount: 2,
    badge: 'Bestseller',
    featured: true,
    reviews: [
      {
        user: 'Anjali B.',
        rating: 5,
        title: 'Like a warm hug in a bottle',
        body: 'Immediately felt calm when I smelled this. The honey-benzoin base is addictive. I have already bought a second bottle.',
        date: new Date('2025-12-10'),
      },
      {
        user: 'Karan D.',
        rating: 5,
        title: 'Best unisex scent I have found',
        body: 'Wears beautifully on both me and my partner. The sillage is soft but persistent. Compliments every time.',
        date: new Date('2025-11-28'),
      },
    ],
  },
  {
    name: 'Sel Marin',
    brand: 'Maison Lumière',
    tagline: 'Sea salt and distance',
    description: 'Driftwood and sea spray on a crisp accord of blue iris and white musks.',
    fullDescription:
      'Sel Marin is the smell of open water viewed from a clifftop — saline air, sun-bleached driftwood, and the faint powderiness of iris. It is a marine fragrance that refuses to be sporty: the blue iris heart lifts it into something genuinely elegant, and the driftwood-musk base gives it an intimate, skin-close finish.',
    price: 2900,
    originalPrice: 3500,
    category: 'Aquatic',
    gender: 'Unisex',
    concentration: 'Eau de Toilette',
    sizes: [
      { ml: 50, price: 2900, inStock: true },
      { ml: 100, price: 4200, inStock: true },
    ],
    images: [
      '/images/bottle5.jpg',
      '/images/bottle6.jpg',
      '/images/bottle7.jpg',
      '/images/bottle8.jpg',
    ],
    thumbnailImage: '/images/bottle5.jpg',
    notes: {
      top: ['Sea Salt', 'Citrus Zest', 'Ambrette'],
      heart: ['Blue Iris', 'Marine Accord', 'Violet Leaf'],
      base: ['Driftwood', 'White Musk', 'Iso E Super'],
    },
    rating: 4.5,
    reviewCount: 1,
    badge: 'Limited',
    featured: false,
    reviews: [
      {
        user: 'Neha G.',
        rating: 5,
        title: 'Fresh without being generic',
        body: 'Every marine/aquatic I have tried before smelled like shampoo. This one is genuinely sophisticated — the iris makes all the difference.',
        date: new Date('2025-11-05'),
      },
    ],
  },
  {
    name: 'Rose Noire',
    brand: 'Maison Lumière',
    tagline: 'The rose after midnight',
    description: 'Turkish rose and black currant on a base of dark woods and cistus.',
    fullDescription:
      'Rose Noire reframes the most familiar note in perfumery — rose — as something untamed. Turkish rose absolute blooms against black currant and tart raspberry, giving it an edge. The heart is pure rose but with a slightly damp, stem-green facet, before the base of cistus, dark patchouli, and cashmeran wrap the whole composition in something that feels genuinely nocturnal.',
    price: 4800,
    originalPrice: null,
    category: 'Floral',
    gender: 'Women',
    concentration: 'Extrait de Parfum',
    sizes: [
      { ml: 30, price: 3200, inStock: true },
      { ml: 50, price: 4800, inStock: true },
    ],
    images: [
      '/images/bottle6.jpg',
      '/images/bottle7.jpg',
      '/images/bottle8.jpg',
      '/images/bottle9.jpg',
    ],
    thumbnailImage: '/images/bottle6.jpg',
    notes: {
      top: ['Black Currant', 'Raspberry', 'Bergamot'],
      heart: ['Turkish Rose Absolute', 'Geranium', 'Violet'],
      base: ['Cistus', 'Dark Patchouli', 'Cashmeran'],
    },
    rating: 4.7,
    reviewCount: 2,
    badge: 'New',
    featured: false,
    reviews: [
      {
        user: 'Ishita M.',
        rating: 5,
        title: 'The rose I was always searching for',
        body: 'I have tried dozens of rose fragrances. This is the only one that smells like an actual rose — complex, slightly thorny, and beautiful.',
        date: new Date('2025-12-15'),
      },
      {
        user: 'Tanvi R.',
        rating: 4,
        title: 'Sophisticated and dark',
        body: 'Not for everyone — this is a confident, full-volume scent. But if you want something that makes a statement, this is it.',
        date: new Date('2025-11-22'),
      },
    ],
  },
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfumeshop';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
