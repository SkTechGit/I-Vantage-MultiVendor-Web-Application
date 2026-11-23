import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

function getEffectiveUri(uri) {
  if (!uri || !uri.startsWith("mongodb+srv://")) return uri;
  if (uri.includes("virtualoffice.sssb12s.mongodb.net")) {
    const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@virtualoffice\.sssb12s\.mongodb\.net\/(.*)$/);
    if (match) {
      const [, user, pass, rest] = match;
      const db = rest.split("?")[0] || "i-vantage";
      return `mongodb://${user}:${pass}@ac-4ypyhvm-shard-00-00.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-01.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-02.sssb12s.mongodb.net:27017/${db}?ssl=true&authSource=admin&replicaSet=atlas-on4dtu-shard-0`;
    }
  }
  return uri;
}

const COMMON_LOCATION = {
  city: "gurugram",
  area: "Welldone Tech Park, Sector 48, Sohna Road, Near Subhash Chowk, Rajiv Chowk, NH-48, Golf Course Extension Road, Gurugram",
  address: "Unit No. 213-14, 2nd Floor, Welldone Tech Park, Sector 48, Sohna Road, Near Subhash Chowk, Gurugram, Haryana – 122001, India",
  lat: 28.419,
  lng: 77.039
};

const VENDOR_ID = new mongoose.Types.ObjectId("6ad33004c819b22e96514018");

const AMENITY_IDS = [
  new mongoose.Types.ObjectId("6ab387371a3c8d5e58817f03"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd6"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd3"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd0"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fcf"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd8"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd2"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd9"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd5"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fce"),
  new mongoose.Types.ObjectId("6ab387371a3c8d5e58817f02"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd1"),
  new mongoose.Types.ObjectId("6ab126a0ac84cfe8d5801fd7")
];

const NEW_LISTINGS = [
  {
    categorySlug: "private-cabin",
    categoryId: new mongoose.Types.ObjectId("6ab11cd6c6ae1658abb82d5d"),
    slug: "private-cabin-office-rent-welldone-tech-park-sohna-road-gurgaon",
    title: "i-VANTAGE Business Hub – Furnished Private Office Cabin for Rent in Welldone Tech Park, Sector 48, Sohna Road, Gurugram",
    pricing: {
      basePrice: 25000,
      currency: "INR",
      unit: "per-month"
    },
    capacity: 4,
    media: [
      { mediaId: new mongoose.Types.ObjectId("6ad6148ad4691004bf6ae181"), order: 0 },
      { mediaId: new mongoose.Types.ObjectId("6ad613d4d4691004bf6ae17f"), order: 1 },
      { mediaId: new mongoose.Types.ObjectId("6ad61363d4691004bf6ae17e"), order: 2 },
      { mediaId: new mongoose.Types.ObjectId("6ad61409d4691004bf6ae180"), order: 3 }
    ],
    description: `### Private Office Cabin at Welldone Tech Park, Sector 48, Gurugram

Looking for a fully furnished, secure private office cabin for your core team? i-VANTAGE Business Hub at Welldone Tech Park, Sohna Road provides lockable executive private cabins designed for privacy, focus, and seamless business growth.

Enjoy sound-insulated glass enclosures, executive desks, ergonomic seating, and complete privacy for leadership discussions and team sprints. With transparent monthly billing starting at **₹25,000 / month**, your business gets an enterprise presence with zero capital expenditure.

---

### Key Cabin Features & Amenities
- **Sound-Insulated Privacy:** Lockable glass cabin keeping strategic discussions confidential.
- **Ergonomic Furnishing:** Premium executive chairs, spacious desks, and lockable storage pedestals.
- **Dedicated High-Speed Fiber Internet:** Redundant enterprise bandwidth for heavy operations and client video calls.
- **Central Air Conditioning & 100% Power Backup:** Work without interruption 24/7.
- **Front Desk & Reception Support:** Professional greeting for clients, courier reception, and visitor management.
- **Meeting Room Credits Included:** Convenient access to 6-seater and conference rooms for client meetings.
- **Pantry & Unlimited Beverages:** Premium tea, coffee, and dining breakout space.
- **Ample Basement & Surface Parking:** Convenient vehicular access right on Sohna Road corridor.

---

### Transparent Pricing
- **Executive Private Cabin (4–6 Seater):** **₹25,000 / month** (All-inclusive)
- **Additional Workstations:** Available upon request.

👉 **Book a Private Tour:** Visit Welldone Tech Park today to experience the private office environment.`
  },
  {
    categorySlug: "conference-room",
    categoryId: new mongoose.Types.ObjectId("6ab387361a3c8d5e58817ef8"),
    slug: "conference-room-for-rent-welldone-tech-park-sector-48-gurgaon",
    title: "i-VANTAGE Business Hub – Executive Conference Room for Hourly Rent in Welldone Tech Park, Sector 48, Sohna Road, Gurugram",
    pricing: {
      basePrice: 500,
      currency: "INR",
      unit: "per-hour"
    },
    capacity: 12,
    media: [
      { mediaId: new mongoose.Types.ObjectId("6ad61170d4691004bf6ae166"), order: 0 },
      { mediaId: new mongoose.Types.ObjectId("6ad61193d4691004bf6ae16a"), order: 1 }
    ],
    description: `### Executive Conference Room & Boardroom in Sector 48, Sohna Road, Gurugram

Host high-stakes board meetings, client presentations, and team strategy townhalls in a professional corporate environment. Located at Welldone Tech Park on Sohna Road, i-VANTAGE Business Hub offers executive conference facilities equipped with modern presentation displays and enterprise connectivity.

Available on flexible hourly and full-day booking slots starting at just **₹500 / hour**, this conference space gives you the freedom to host without the overhead of maintaining an in-house boardroom.

---

### Conference Room Infrastructure
- **10–12 Seater Executive Table:** Ergonomic leather boardroom chairs designed for long productive sessions.
- **High-Definition Presentation Display:** HDMI/Wireless screen sharing for presentations, pitches, and remote video calls.
- **Dedicated High-Speed Wi-Fi:** Low-latency fiber internet dedicated to your presentation screen and conference devices.
- **Writing Whiteboard & Marker Kit:** Brainstorming and visual roadmap planning ready.
- **Full Air Conditioning & Generator Backup:** Uninterrupted presentation continuity.
- **Front Desk Greeting & Beverage Service:** Warm reception for your guests with water and tea/coffee service.

---

### Booking & Rates
- **Hourly Conference Rate:** **₹500 / hour**
- **Full-Day Corporate Booking:** Available on request with discounted day packages.

👉 **Reserve Your Slot:** Check instant availability and book your conference room at Welldone Tech Park today.`
  },
  {
    categorySlug: "dedicated-desk",
    categoryId: new mongoose.Types.ObjectId("6ab387361a3c8d5e58817efb"),
    slug: "dedicated-desk-coworking-welldone-tech-park-sector-48-gurgaon",
    title: "i-VANTAGE Business Hub – Dedicated Desk & Fixed Coworking Workstation in Welldone Tech Park, Sector 48, Sohna Road, Gurugram",
    pricing: {
      basePrice: 7000,
      currency: "INR",
      unit: "per-month"
    },
    capacity: 120,
    media: [
      { mediaId: new mongoose.Types.ObjectId("6ad616dbd4691004bf6ae1a3"), order: 0 },
      { mediaId: new mongoose.Types.ObjectId("6ad6148ad4691004bf6ae181"), order: 1 },
      { mediaId: new mongoose.Types.ObjectId("6ad613d4d4691004bf6ae17f"), order: 2 },
      { mediaId: new mongoose.Types.ObjectId("6ad61363d4691004bf6ae17e"), order: 3 }
    ],
    description: `### Dedicated Coworking Desk at Welldone Tech Park, Sector 48, Gurugram

Need your own permanent workstation without the lock-in of an entire private cabin? A Dedicated Desk at i-VANTAGE Business Hub gives you your own reserved seat with lockable storage, ready every morning when you arrive.

Work in a quiet, modern community of entrepreneurs, consultants, and remote specialists at Welldone Tech Park, Sector 48, Sohna Road. Enjoy the freedom to establish your daily work rhythm with 100% plug-and-play ease.

---

### What's Included with Your Dedicated Desk
- **Reserved Permanent Workstation:** Your own fixed desk that no one else can occupy.
- **Lockable Pedestal Storage:** Safely leave your monitor, documents, and personal belongings overnight.
- **High-Speed Fiber Wi-Fi & LAN Option:** Fast, stable connectivity with dedicated power ports at each desk.
- **Ergonomic Mesh Chair:** Lumbar-support seating designed for long, comfortable work sessions.
- **Front-Desk Reception & Mail Handling:** Official business correspondence received securely on your behalf.
- **Pantry Access & Free Beverages:** Refreshment breakout zone with complimentary tea and coffee.
- **Meeting Room Booking Access:** Discounted credits for meeting and conference room reservations.

---

### Transparent Pricing
- **Monthly Dedicated Desk:** **₹7,000 / month** (All-inclusive, no hidden maintenance fees)

👉 **Secure Your Desk:** Book a walkthrough at Welldone Tech Park to claim your dedicated seat.`
  }
];

async function run() {
  const rawUri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    const alt = getEffectiveUri(rawUri);
    await mongoose.connect(alt, { serverSelectionTimeoutMS: 8000 });
  }

  const db = mongoose.connection;
  const listingsCol = db.collection("marketplace_listings");
  const servicesCol = db.collection("marketplace_services");

  // Fetch the 5 services we created earlier
  const welldoneServices = await servicesCol.find({
    name: /Welldone Tech Park/i
  }).toArray();
  const serviceIds = welldoneServices.map(s => s._id);

  console.log(`Linking ${serviceIds.length} custom services to new listings...`);

  for (const item of NEW_LISTINGS) {
    const existing = await listingsCol.findOne({
      $or: [
        { slug: item.slug },
        { categoryId: item.categoryId, "location.address": /Welldone Tech Park/i }
      ]
    });

    const listingDoc = {
      vendorId: VENDOR_ID,
      title: item.title,
      slug: item.slug,
      description: item.description,
      categoryId: item.categoryId,
      location: COMMON_LOCATION,
      pricing: item.pricing,
      capacity: item.capacity,
      serviceIds: serviceIds,
      amenityIds: AMENITY_IDS,
      customAmenities: [],
      media: item.media,
      status: "approved",
      isLive: true,
      rejectionReason: "",
      lastEditedBy: VENDOR_ID,
      publishedAt: new Date(),
      legacySlugs: [],
      updatedAt: new Date()
    };

    if (existing) {
      await listingsCol.updateOne(
        { _id: existing._id },
        { $set: listingDoc }
      );
      console.log(`✅ Updated existing listing for ${item.categorySlug} (id: ${existing._id}, slug: ${item.slug})`);
    } else {
      listingDoc.createdAt = new Date();
      const res = await listingsCol.insertOne(listingDoc);
      console.log(`✅ Created NEW listing for ${item.categorySlug} (id: ${res.insertedId}, slug: ${item.slug})`);
    }
  }

  // Audit total listings for Welldone Tech Park
  const welldoneAll = await listingsCol.find({
    $or: [
      { slug: /welldone/i },
      { "location.address": /welldone/i },
      { title: /welldone/i }
    ],
    status: "approved",
    isLive: true
  }).toArray();

  console.log(`\n🎉 Welldone Tech Park now has ${welldoneAll.length} LIVE listings across categories:`);
  welldoneAll.forEach((l, idx) => {
    console.log(`${idx + 1}. [${l.categoryId}] ${l.title} (Slug: ${l.slug}, Price: ₹${l.pricing?.basePrice}/${l.pricing?.unit})`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
