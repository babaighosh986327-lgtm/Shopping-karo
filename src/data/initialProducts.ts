import { Product, Category, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-shoulder',
    name: 'Shoulder Bags',
    slug: 'shoulder-bags',
    description: 'Effortlessly chic silhouettes designed to sit gracefully on the shoulder.',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
    order: 1,
    active: true
  },
  {
    id: 'cat-totes',
    name: 'Totes & Shoppers',
    slug: 'totes-shoppers',
    description: 'Spacious architectural carryalls crafted from supple full-grain Italian leather.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    order: 2,
    active: true
  },
  {
    id: 'cat-crossbody',
    name: 'Crossbody Bags',
    slug: 'crossbody-bags',
    description: 'Hands-free luxury crafted for city strolls, travel, and day-to-night elegance.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    order: 3,
    active: true
  },
  {
    id: 'cat-clutches',
    name: 'Evening Clutches',
    slug: 'evening-clutches',
    description: 'Sculptural statements adorned with champagne gold clasps and jewel tones.',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
    order: 4,
    active: true
  },
  {
    id: 'cat-satchels',
    name: 'Top Handle Satchels',
    slug: 'top-handle-satchels',
    description: 'Structured timeless silhouettes with signature hand-finished rolled handles.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    order: 5,
    active: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-palazzo-flap',
    name: 'The Palazzo Flap Shoulder Bag',
    slug: 'palazzo-flap-shoulder-bag',
    shortDescription: 'Signature quilted Italian calfskin with champagne gold twist lock.',
    description: 'Masterfully handcrafted in Florence from butter-soft chevron quilted calfskin. The Palazzo Flap features our hallmark champagne gold padlock turn-lock and an adaptable woven chain strap that glides seamlessly between single and dual shoulder lengths. Spacious lined interior with central zip divider.',
    price: 495,
    salePrice: 420,
    categoryId: 'cat-shoulder',
    categoryName: 'Shoulder Bags',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    active: true,
    rating: 4.9,
    reviewsCount: 128,
    material: '100% Full Grain Italian Nappa Calfskin',
    dimensions: '26 cm (W) × 17 cm (H) × 9 cm (D)',
    careInstructions: 'Avoid direct sunlight and water. Clean gently with a soft microfibre cloth and store in the provided silk dust bag.',
    features: [
      'Hand-stitched chevron quilting',
      'Champagne gold custom hardware',
      'Adjustable sliding curb chain strap',
      'Dual interior compartments with secure zip pocket'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-palazzo-noir',
        colorName: 'Noir Caviar',
        colorHex: '#18181B',
        sku: 'PLZ-FLAP-BLK-01',
        stock: 14,
        price: 495,
        salePrice: 420,
        images: [
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-palazzo-champagne',
        colorName: 'Champagne Beige',
        colorHex: '#E5D3B3',
        sku: 'PLZ-FLAP-BGE-02',
        stock: 9,
        price: 495,
        salePrice: 420,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-palazzo-blush',
        colorName: 'Blush Rose',
        colorHex: '#E8B4B8',
        sku: 'PLZ-FLAP-ROSE-03',
        stock: 6,
        price: 520,
        salePrice: 440,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-sienna-tote',
    name: 'The Sienna Grand Tote',
    slug: 'sienna-grand-tote',
    shortDescription: 'Architectural everyday carryall with laptop pocket and suede lining.',
    description: 'Designed for the modern connoisseur, The Sienna Grand Tote combines structured architectural lines with remarkable storage capacity. Fits up to a 15-inch laptop, tablet, planner, and daily essentials with grace. Features reinforced base studs, a detachable zip pouch, and magnetic top closure.',
    price: 580,
    categoryId: 'cat-totes',
    categoryName: 'Totes & Shoppers',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    active: true,
    rating: 4.8,
    reviewsCount: 94,
    material: 'Full-Grain Tuscan Pebble Leather',
    dimensions: '38 cm (W) × 29 cm (H) × 14 cm (D)',
    careInstructions: 'Condition annually with premium beeswax leather balm. Keep away from inks and harsh solvents.',
    features: [
      'Padded laptop compartment fits up to 15"',
      'Detachable luxury zip wristlet included',
      'Solid brass feet to preserve base leather',
      'Ultra-soft micro-suede protective lining'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-sienna-cognac',
        colorName: 'Cognac Saddle',
        colorHex: '#9E5B32',
        sku: 'SNA-TOTE-CGN-01',
        stock: 18,
        price: 580,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-sienna-noir',
        colorName: 'Midnight Noir',
        colorHex: '#1A1A1A',
        sku: 'SNA-TOTE-MID-02',
        stock: 12,
        price: 580,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-sienna-cream',
        colorName: 'Ivory Cream',
        colorHex: '#F6F1E9',
        sku: 'SNA-TOTE-IVR-03',
        stock: 5,
        price: 610,
        images: [
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-amalfi-crossbody',
    name: 'The Amalfi Saddle Crossbody',
    slug: 'amalfi-saddle-crossbody',
    shortDescription: 'Curved equestrian silhouette with sculpted gold equestrian buckle.',
    description: 'Inspired by coastal Italian promenades, the Amalfi Saddle balances relaxed bohemian charm with immaculate artisanal craft. A curved silhouette accented with sculpted brushed gold hardware and a wide detachable guitar strap for all-day comfort.',
    price: 385,
    salePrice: 325,
    categoryId: 'cat-crossbody',
    categoryName: 'Crossbody Bags',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    active: true,
    rating: 4.95,
    reviewsCount: 76,
    material: 'Smooth Box Calfskin with Contrast Edge Paint',
    dimensions: '22 cm (W) × 18 cm (H) × 7.5 cm (D)',
    careInstructions: 'Store in cool dry conditions. Use clean cotton flannel cloth for light dusting.',
    features: [
      'Two interchangeable straps (leather and jacquard)',
      'Exterior back slip pocket for smartphone',
      'Concealed magnetic snap closure',
      'Gold foil embossed series monogram'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-amalfi-emerald',
        colorName: 'Forest Emerald',
        colorHex: '#1B4D3E',
        sku: 'AMF-SAD-EMR-01',
        stock: 8,
        price: 385,
        salePrice: 325,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-amalfi-cognac',
        colorName: 'Vintage Cognac',
        colorHex: '#A0522D',
        sku: 'AMF-SAD-VNT-02',
        stock: 15,
        price: 385,
        salePrice: 325,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-amalfi-noir',
        colorName: 'Onyx Noir',
        colorHex: '#111111',
        sku: 'AMF-SAD-ONX-03',
        stock: 11,
        price: 385,
        salePrice: 325,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-luna-clutch',
    name: 'The Luna Sculpted Minaudière',
    slug: 'luna-sculpted-minaudiere',
    shortDescription: 'Gala-ready metallic framed evening clutch with jewel drop chain.',
    description: 'An architectural work of art for red-carpet soirées, galas, and romantic evenings. Hand-cast champagne metal frame lined with satin silk, housing a magnetic kiss-lock and an optional delicate serpent chain.',
    price: 340,
    categoryId: 'cat-clutches',
    categoryName: 'Evening Clutches',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    active: true,
    rating: 5.0,
    reviewsCount: 42,
    material: 'Hammered Satin & 18K Champagne Gold Electroplate',
    dimensions: '20 cm (W) × 12 cm (H) × 5 cm (D)',
    careInstructions: 'Gently wipe metal frame with lint-free jewelry cloth.',
    features: [
      'Hand-cast jeweler frame with pave gemstone detail',
      'Detachable 45" serpent chain shoulder drop',
      'Silk satin lining with cards slip',
      'Fits standard evening phones and lip gloss'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-luna-gold',
        colorName: 'Champagne Gold',
        colorHex: '#D4AF37',
        sku: 'LNA-CLT-GLD-01',
        stock: 7,
        price: 340,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-luna-noir',
        colorName: 'Velvet Noir',
        colorHex: '#121212',
        sku: 'LNA-CLT-VLV-02',
        stock: 10,
        price: 340,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-luna-rose',
        colorName: 'Pearl Rose',
        colorHex: '#EBC7C9',
        sku: 'LNA-CLT-PRL-03',
        stock: 4,
        price: 360,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-bellagio-satchel',
    name: 'The Bellagio Top Handle Satchel',
    slug: 'bellagio-top-handle-satchel',
    shortDescription: 'Regal trapezoid silhouette with structured top handle and padlock charm.',
    description: 'The epitome of high-society poise. Handcrafted from scratch-resistant Epsom leather, The Bellagio boasts clean architectural geometry, rolled structured handles, and our signature engraved padlock bell charm. Includes a matching adjustable shoulder strap.',
    price: 640,
    salePrice: 560,
    categoryId: 'cat-satchels',
    categoryName: 'Top Handle Satchels',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    active: true,
    rating: 4.9,
    reviewsCount: 165,
    material: 'French Epsom Textured Grain Leather',
    dimensions: '30 cm (W) × 22 cm (H) × 12 cm (D)',
    careInstructions: 'Store in included cotton flannel bag with filler paper to maintain crisp shape.',
    features: [
      'Sturdy structured base with protective brass studs',
      'Detachable key clochette with mini padlock',
      'Dual smartphone pockets and interior zippered sanctuary',
      'Removable 50 cm shoulder strap'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-bellagio-bordeaux',
        colorName: 'Bordeaux Plum',
        colorHex: '#581845',
        sku: 'BLG-STC-BDX-01',
        stock: 10,
        price: 640,
        salePrice: 560,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-bellagio-noir',
        colorName: 'Classic Noir',
        colorHex: '#1F1F1F',
        sku: 'BLG-STC-CLS-02',
        stock: 16,
        price: 640,
        salePrice: 560,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-bellagio-biscotti',
        colorName: 'Warm Biscotti',
        colorHex: '#CDB196',
        sku: 'BLG-STC-WBM-03',
        stock: 7,
        price: 640,
        salePrice: 560,
        images: [
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-sorrento-bucket',
    name: 'The Sorrento Drawstring Bucket',
    slug: 'sorrento-drawstring-bucket',
    shortDescription: 'Cylindrical soft-pleated bucket bag with handcrafted tassel pull.',
    description: 'Effortlessly feminine and endlessly versatile. The Sorrento Bucket reimagines relaxed elegance with its gathered supple silhouette, custom gold eyelets, and hand-plaited leather tassels. Includes an interior magnetic security lock.',
    price: 430,
    categoryId: 'cat-crossbody',
    categoryName: 'Crossbody Bags',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    active: true,
    rating: 4.85,
    reviewsCount: 58,
    material: 'Natural Grain Lambskin with Nappa Trim',
    dimensions: '20 cm (W) × 24 cm (H) × 15 cm (D)',
    careInstructions: 'Avoid prolonged contact with dark denim or dye-transfer fabrics.',
    features: [
      'Solid brass eyelets with braided drawstring cord',
      'Dual hand-knotted leather tassels',
      'Flat reinforced base with 4 gold feet',
      'Internal zip pocket and key clip'
    ],
    defaultColorIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variations: [
      {
        id: 'var-sorrento-taupe',
        colorName: 'Cashmere Taupe',
        colorHex: '#BFAFA6',
        sku: 'SRN-BKT-CSH-01',
        stock: 9,
        price: 430,
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-sorrento-caramel',
        colorName: 'Salted Caramel',
        colorHex: '#C68B59',
        sku: 'SRN-BKT-CAR-02',
        stock: 12,
        price: 430,
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 'var-sorrento-olive',
        colorName: 'Tuscan Olive',
        colorHex: '#556B2F',
        sku: 'SRN-BKT-OLV-03',
        stock: 4,
        price: 450,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ]
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'LUXEBAG',
  contactEmail: 'concierge@luxebag-paris.com',
  contactPhone: '+1 (800) 589-3224',
  currency: 'USD',
  currencySymbol: '$',
  freeShippingThreshold: 250,
  standardShippingFee: 25,
  announcementBarText: 'Complimentary Worldwide Shipping on Orders Over $250 • Complimentary Gift Boxing',
  announcementBarActive: true,
  bannerTitle: 'L’Art de la Maroquinerie',
  bannerSubtitle: 'Autumn & Winter Capsule Collection — Handcrafted from full-grain Florentine leathers with bespoke champagne gold accents.',
  bannerImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
  testPaymentMode: true
};
