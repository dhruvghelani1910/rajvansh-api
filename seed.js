import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './utilities/connection.js';
import User from './models/user.js';
import Collection from './models/collection.js';
import Gallery from './models/gallery.js';
import Blog from './models/blog.js';
import Testimonial from './models/testimonial.js';
import Category from './models/category.js';

dotenv.config();

const collectionsData = [
  {
    name: "Rajwadi Panchrangi Safa",
    category: "Rajwadi Safa",
    color: "Multi-color (Five Colors)",
    fabric: "Georgette",
    occasion: "Royal Weddings & Festivals",
    availability: "Available",
    price: "₹1,200",
    image: "/rajwadi_panchrangi_safa.png",
    description: "Classic Rajasthani five-color panel Safa, symbolizing happiness and prosperity. Features delicate tying texture with premium georgette fabric."
  },
  {
    name: "Jodhpuri Royal Pachrangi",
    category: "Jodhpuri Safa",
    color: "Red, Yellow & Gold",
    fabric: "Cotton Silk",
    occasion: "Weddings & Traditional Welcomes",
    availability: "Available",
    price: "₹950",
    image: "/jodhpuri_royal_pachrangi.png",
    description: "Authentic Jodhpuri style with structured band tying. Adds a royal posture to the wearer, perfect for wedding barats."
  },
  {
    name: "Maharaja Zari Paghadi",
    category: "Maharaja Paghadi",
    color: "Royal Crimson & Gold Zari",
    fabric: "Chanderi Silk",
    occasion: "Groom Wear & Royal Events",
    availability: "Available",
    price: "₹2,500",
    image: "/maharaja_zari_paghadi.png",
    description: "Pre-stitched or hand-tied Maharaja-style Paghadi featuring golden zari work, decorative kalgi attachment, and a majestic trail."
  },
  {
    name: "Groom Specially Embellished Safa",
    category: "Groom Special",
    color: "Peach & Ivory Gold",
    fabric: "Organza Silk",
    occasion: "Groom Entrance / Wedding Rituals",
    availability: "Available",
    price: "₹3,200",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=600",
    description: "Custom-made groom safa adorned with premium stone-studded kalgi, golden borders, and matching pearls. Matches ivory sherwanis."
  },
  {
    name: "Family Matching Kesariya Safa",
    category: "Family Matching",
    color: "Saffron / Kesariya",
    fabric: "Pure Cotton",
    occasion: "Barat & Family Events",
    availability: "Available",
    price: "₹450",
    image: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=600",
    description: "Uniform saffron colored safas for family members and baratis. Soft breathable cotton fabric, comfortable for long wedding rituals."
  },
  {
    name: "Kids Festive Safa",
    category: "Kids Safa",
    color: "Bright Pink & Gold",
    fabric: "Soft Silk-blend",
    occasion: "Festivals & Family Functions",
    availability: "Available",
    price: "₹600",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
    description: "Lightweight, pre-stitched, easy-to-wear safa designed specifically for kids. Gentle inner lining to ensure zero skin irritation."
  },
  {
    name: "Corporate Event Welcome Safa",
    category: "Corporate Events",
    color: "Golden Yellow",
    fabric: "Sateen Cotton",
    occasion: "Corporate Welcomes & Award Shows",
    availability: "Available",
    price: "₹550",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
    description: "Elegant and simple welcome turbans for national and international delegates, providing an instant traditional Indian warm welcome."
  },
  {
    name: "Royal Ceremonial Talwar (Sword)",
    category: "Accessories",
    color: "Gold hilt with Crimson sheath",
    fabric: "Stainless Steel & Velvet",
    occasion: "Groom Accessory / Barat",
    availability: "Available",
    price: "₹4,500",
    image: "/royal_ceremonial_sword.png",
    description: "Premium ceremonial sword (unsharpened) featuring an intricately designed brass golden hilt and a luxurious velvet-wrapped sheath. Essential for royal groom appearance."
  },
  {
    name: "Designer Wedding Khes (Shawl)",
    category: "Accessories",
    color: "Ivory with Golden Brocade",
    fabric: "Banarasi Silk",
    occasion: "Wedding Reception & Pheras",
    availability: "Available",
    price: "₹1,800",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    description: "Traditional royal shawl/khes draped over the groom's sherwani. Styled with intricate Banarasi zari work and exquisite tassels."
  },
  {
    name: "Heritage Ceremonial Katar (Dagger)",
    category: "Accessories",
    color: "Silver & Gold Antique Finish",
    fabric: "Alloy Steel & Carved Wood",
    occasion: "Groom Accessory / Traditional Puja",
    availability: "Available",
    price: "₹2,200",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
    description: "A compact ceremonial dagger featuring a traditional H-shaped handle grip and ornate carvings. Worn on the groom's waistband belt."
  },
  {
    name: "Mewari Royal Paghadi",
    category: "Maharaja Paghadi",
    color: "Deep Red & Saffron",
    fabric: "Bandhani Silk",
    occasion: "Royal Themes & Heritage Festivals",
    availability: "Available",
    price: "₹2,800",
    image: "/mewari_royal_paghadi.png",
    description: "Historic Mewar style turban using authentic tie-and-dye bandhani fabric. Accented with pearl strings and a high-crest feather."
  },
  {
    name: "Custom Matching Groom Paghadi Set",
    category: "Custom Design",
    color: "Customized according to theme",
    fabric: "Choice of Silk, Organza, or Velvet",
    occasion: "Wedding Theme Alignment",
    availability: "On Order Only",
    price: "Contact for Quote",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600",
    description: "Completely customizable. Bring your outfit or wedding theme guidelines, and our designers will hand-dye and custom-embellish a safa specifically for you."
  }
];

const galleryData = [
  {
    title: "Royal Rajwadi Groom Theme",
    category: "Groom Collection",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    caption: "A magnificent groom styled in Maharaja Paghadi accented with custom gemstones and feathers."
  },
  {
    title: "Grand Barat Welcome",
    category: "Barat",
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=800",
    caption: "Over 100 baratis styled in uniform saffron Jodhpuri Safas, creating a spectacular visual."
  },
  {
    title: "Elegant Destination Wedding",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=800",
    caption: "Sunset wedding ceremony where all guests were tied customized pastel pink safas."
  },
  {
    title: "Corporate Excellence Event",
    category: "Corporate Events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    caption: "Welcoming international business delegates with orange safas, blending culture and business."
  },
  {
    title: "Traditional Ganesh Utsav",
    category: "Festivals",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800",
    caption: "Dignitaries wearing Peshwai Paghadi celebrating Ganesh festival ceremonies."
  },
  {
    title: "Celebrity Wedding Setup",
    category: "Celebrity Events",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
    caption: "Bollywood celebrity wedding where the groom opted for our custom Banarasi silk safa."
  },
  {
    title: "Royal Rajputana Theme Night",
    category: "Royal Themes",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800",
    caption: "Groom posing with our handcrafted Royal Talwar (Sword) and crimson Chanderi Safa."
  },
  {
    title: "Family Portrait Coordination",
    category: "Weddings",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    caption: "Three generations of a royal family styled in custom pink-gold organza turbans."
  }
];

const blogsData = [
  {
    title: "Different Types of Rajasthani Safa & Their Cultural Significance",
    slug: "types-of-rajasthani-safa",
    date: "May 15, 2026",
    author: "Shivbhavani Heritage Team",
    image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=800",
    excerpt: "Safa is not just a piece of cloth; it is the crown of Indian tradition. Explore the differences between Jodhpuri, Mewari, and Panchrangi styles.",
    content: `In Rajasthan and throughout India, the headgear worn by men is more than just a fashion statement—it is a symbol of respect, honor, and heritage. Known as 'Safa' or 'Paghadi', these colorful turbans carry deep historical roots.

### 1. Jodhpuri Safa
The Jodhpuri Safa is known for its curved shape and short, compact drapes. Normally tied with colorful Bandhani (tie-and-dye) fabric or Panchrangi (five-colored) stripes, it gives the wearer a very sharp, royal look. It is highly popular for modern grooms.

### 2. Mewari Paghadi
Originating from the Udaipur (Mewar) region, these paghadis are flatter and wider, reflecting a historic warrior look. They are usually pre-tied and decorated with beautiful pearls and strings.

### 3. Panchrangi (Five-Colored) Safa
Panchrangi represents five holy colors: Red, Yellow, Green, White, and Saffron. It is worn on highly auspicious occasions like weddings and major festivals as it represents blessings, joy, and peace.

At Shivbhavani Safa & Paghadi, we ensure every fold of your turban matches the historical authenticity of these royal regions.`,
    metatitle: "Different Types of Rajasthani Safa Styles | Shivbhavani",
    metadesc: "Discover the cultural significance and history of Jodhpuri, Mewari, and Panchrangi safas worn at Indian weddings.",
    keywords: "Rajasthani safa, Jodhpuri safa, Mewari paghadi, Panchrangi safa"
  },
  {
    title: "How to Choose the Perfect Wedding Paghadi for the Groom",
    slug: "perfect-wedding-paghadi-groom",
    date: "June 02, 2026",
    author: "Ranjit Singh (Owner)",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    excerpt: "Choosing your wedding turban requires matching your sherwani, height, face shape, and wedding theme. Follow our simple style guide.",
    content: `Your wedding day is the one time you get to feel like a king, and your Paghadi is your crown. Here is a quick guide to help grooms select the perfect style:

### Match Your Sherwani
If your sherwani is heavily embroidered (e.g., gold zari work), choose a solid pastel color safa (like peach, mint, or ivory) to create balance. If your sherwani is simple, a vibrant Banarasi silk or Panchrangi safa will elevate the entire outfit.

### Consider the Weight and Fabric
Grooms have to wear the safa for hours during long rituals. Light fabrics like Organza, Georgette, and Chanderi Silk are breathable and sit comfortably, while heavy Velvet or Brocade silk looks grand but can feel warm.

### The Power of Embellishments
Never skip the Kalgi (turban brooch). A stone-studded Kalgi with a single feather adds that Maharaja royal status instantly. Combine it with a delicate string of pearls (Moti Mala) wrapped around the safa.

At Shivbhavani, we offer personal consultations to match your safa, talwar (sword), and khes (shawl) seamlessly.`,
    metatitle: "Groom Wedding Paghadi Tying & Selection Guide | Shivbhavani",
    metadesc: "A masterclass style guide on matching fabrics, colors, and kalgi embellishments for the perfect wedding day look.",
    keywords: "groom paghadi, wedding turban styling, wedding sherwani match, bridal turban"
  },
  {
    title: "The Significance of Royal Accessories: Talwar, Katar, and Khes",
    slug: "royal-accessories-significance",
    date: "June 08, 2026",
    author: "Shivbhavani Heritage Team",
    image: "https://images.unsplash.com/photo-1599824419829-0ec82f059296?auto=format&fit=crop&q=80&w=800",
    excerpt: "A groom's royal attire is incomplete without traditional accessories. Discover why the Talwar, Katar, and Khes are essential.",
    content: `When a groom prepares for his wedding day, his clothing is only half the story. The royal traditions of India mandate that the groom carries symbolic objects representing protection, dignity, and wealth.

### 1. The Ceremonial Talwar (Sword)
The groom carries a sword to represent his role as a protector of his new family. Historically, it symbolized valor. Today, a beautifully carved brass-hilt sword wrapped in velvet sheath acts as the primary accessory carried during the groom's horse-riding procession (Barat).

### 2. The Ceremonial Katar (Dagger)
The Katar is a compact ceremonial dagger tucked into the waistband. Historically used in close combat, it symbolizes vigilance. In weddings, it represents keeping negative energies away and protecting the bride.

### 3. The Royal Khes (Shawl)
Draped gracefully across the shoulder, the Khes is a woven silk or cotton shawl. It is the final layer of elegance, establishing the groom's stature as the host of the royal celebration.

At Shivbhavani Safa & Paghadi, we custom curate matching sets of Safas, Talwars, Katars, and Khes to make every groom look majestic.`,
    metatitle: "Why Grooms Carry Sword, Katar & Khes | Shivbhavani",
    metadesc: "Learn the rich history and symbolic meaning behind carrying ceremonial swords, daggers, and drapes during Indian weddings.",
    keywords: "groom sword, talwar wedding, katar ceremonial, royal khes shawl"
  }
];

const testimonialsData = [
  {
    name: "Vikram Rathore",
    rating: 5,
    review: "Amazing service! The Shivbhavani team arrived 1 hour before our wedding barat in Pune. They tied Safas for 80 guests in less than an hour, and everyone looked extremely elegant. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Pooja Patel",
    rating: 5,
    review: "We ordered matching pink custom safas for all family members. The color dyed by them was an exact match to my bridal lehenga! The cotton fabric was very soft and easy to wear all day.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Devendra Shah",
    rating: 5,
    review: "Superb craftsmanship! I got my Maharaja groom paghadi along with a matching Talwar and Khes. The coordination of gold accents on the sword hilt and my paghadi kalgi was outstanding.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
  }
];

const seed = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Collection.deleteMany({});
    await Gallery.deleteMany({});
    await Blog.deleteMany({});
    await Testimonial.deleteMany({});
    try {
      await mongoose.connection.db.collection('categories').drop();
      console.log("Dropped categories collection to reset indexes.");
    } catch (err) {
      // Ignore if collection doesn't exist yet
    }

    console.log("Seeding categories (Product & Gallery)...");
    const productCategories = [
      "Rajwadi Safa",
      "Jodhpuri Safa",
      "Maharaja Paghadi",
      "Accessories",
      "Groom Special",
      "Family Matching",
      "Kids Safa",
      "Corporate Events",
      "Custom Design"
    ];
    const galleryCategories = [
      "Groom Collection",
      "Weddings",
      "Barat",
      "Corporate Events",
      "Festivals",
      "Celebrity Events",
      "Royal Themes"
    ];
    const categoriesData = [
      ...productCategories.map(cat => ({ name: cat, type: 'product', description: `${cat} collection items` })),
      ...galleryCategories.map(cat => ({ name: cat, type: 'gallery', description: `${cat} gallery items` }))
    ];
    await Category.insertMany(categoriesData);

    console.log("Seeding default admin user...");
    const adminUser = new User({
      username: 'admin',
      password: 'password'
    });
    await adminUser.save();

    console.log("Seeding collection entries...");
    await Collection.insertMany(collectionsData);

    console.log("Seeding gallery photos...");
    await Gallery.insertMany(galleryData);

    console.log("Seeding blog posts...");
    await Blog.insertMany(blogsData);

    console.log("Seeding testimonials...");
    await Testimonial.insertMany(testimonialsData);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seed();
