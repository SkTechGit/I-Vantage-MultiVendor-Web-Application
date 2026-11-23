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

const DESCRIPTION = `### Built for Focused Work. Designed for Pure Flexibility.

Stop wasting hours setting up office infrastructure. Located at Welldone Tech Park on Sohna Road, this space gives you a quiet, productive workspace from day one. You get the freedom to scale on your terms with zero long-term lease lock-ins.

Enjoy quick access to Subhash Chowk, Rajiv Chowk, and NH-48. Walk in, plug in, and get straight to work alongside serious professionals and founders.

---

### The Setup
Everything you need to run your business without friction:

- **High-Speed Wi-Fi:** Enterprise-grade fiber internet with redundant connectivity.
- **Ergonomic Chairs & Workstations:** Built for all-day comfort and long deep-work sprints.
- **100% Power Backup:** Uninterrupted work guaranteed during outages.
- **Central Air Conditioning:** Climate-controlled workspace all year round.
- **Professional Front Desk:** Client greeting, courier reception, and visitor check-in.
- **On-Site Cafeteria & Pantry:** Fresh coffee, tea, and dining breakout zones.
- **Dedicated Parking & Multi-Elevator Access:** Ample parking space with high-speed lifts.
- **24/7 Monitored Security:** CCTV surveillance, bio-metric access, and guarded entry.

---

### The Price
Transparent pricing. No hidden maintenance charges. No surprise utility fees.

- **Coworking Seat:** **₹7,000 / month** (All-inclusive)

---

### Ready to Upgrade Your Workday?
Experience the vibe before making any commitment.

👉 **Book a Visit** — Schedule your walkthrough today.`;

async function publish() {
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

  const vendorId = new mongoose.Types.ObjectId("6ad33004c819b22e96514018");

  // 1. Create or ensure custom services exist
  const customServices = [
    {
      name: "Private Cabin (Welldone Tech Park)",
      size: "1 Cabin (4-6 Seats)",
      price: 25000,
      unit: "month",
      description: "Lockable, sound-insulated private office for team privacy and confidential operations.",
      vendorId,
      createdBy: vendorId,
      isGlobal: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Meeting Room (Welldone Tech Park)",
      size: "6 Seater",
      price: 500,
      unit: "hour",
      description: "6-8 seater professional meeting room with presentation screen and conferencing Wi-Fi.",
      vendorId,
      createdBy: vendorId,
      isGlobal: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Conference Room (Welldone Tech Park)",
      size: "10-12 Seater",
      price: 500,
      unit: "hour",
      description: "Executive boardroom layout for client pitches, presentations, and team townhalls.",
      vendorId,
      createdBy: vendorId,
      isGlobal: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Dedicated Desk (Welldone Tech Park)",
      size: "1 Dedicated Desk",
      price: 7000,
      unit: "month",
      description: "Reserved personal workstation with lockable drawer, power point, and ergonomic chair.",
      vendorId,
      createdBy: vendorId,
      isGlobal: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Hot Desk (Welldone Tech Park)",
      size: "1 Flexible Seat",
      price: 7000,
      unit: "month",
      description: "Flexible plug-and-play seat in open collaboration zone with high-speed internet.",
      vendorId,
      createdBy: vendorId,
      isGlobal: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const serviceIds = [];
  for (const s of customServices) {
    let existing = await servicesCol.findOne({ name: s.name });
    if (!existing) {
      const res = await servicesCol.insertOne(s);
      serviceIds.push(res.insertedId);
      console.log(`Created service: ${s.name} (id: ${res.insertedId})`);
    } else {
      await servicesCol.updateOne(
        { _id: existing._id },
        { $set: { price: s.price, unit: s.unit, size: s.size, description: s.description, isActive: true, updatedAt: new Date() } }
      );
      serviceIds.push(existing._id);
      console.log(`Updated service: ${s.name} (id: ${existing._id})`);
    }
  }

  // 2. Update the Coworking Listing
  const coworkingListing = await listingsCol.findOne({
    $or: [
      { slug: "coworking-space-gurgaon-sector-48-sohna-road" },
      { slug: "ivantage-coworking-welldone-tech-park" }
    ]
  });

  if (coworkingListing) {
    const legacySlugs = coworkingListing.legacySlugs || [];
    if (!legacySlugs.includes("ivantage-coworking-welldone-tech-park")) {
      legacySlugs.push("ivantage-coworking-welldone-tech-park");
    }

    await listingsCol.updateOne(
      { _id: coworkingListing._id },
      {
        $set: {
          slug: "coworking-space-gurgaon-sector-48-sohna-road",
          title: "i-VANTAGE Business Hub – Coworking Space in Sector 48, Sohna Road, Gurgaon",
          description: DESCRIPTION,
          "pricing.basePrice": 7000,
          "pricing.currency": "INR",
          "pricing.unit": "per-month",
          serviceIds,
          status: "approved",
          isLive: true,
          publishedAt: new Date(),
          legacySlugs,
          updatedAt: new Date()
        }
      }
    );
    console.log(`\n✅ Coworking Listing Updated & set to isLive: true! (Slug: coworking-space-gurgaon-sector-48-sohna-road)`);
  }

  // 3. Also make sure Virtual Office & Meeting Room for Welldone Tech Park are isLive: true
  const voResult = await listingsCol.updateOne(
    { slug: "ivantage-virtual-office-welldone-tech-park-gurgaon" },
    { $set: { isLive: true, status: "approved", updatedAt: new Date() } }
  );
  console.log(`✅ Virtual Office Welldone Tech Park isLive set to true (modified: ${voResult.modifiedCount})`);

  const mrResult = await listingsCol.updateOne(
    { slug: "ivantage-meeting-room-welldone-tech-park" },
    { $set: { isLive: true, status: "approved", updatedAt: new Date() } }
  );
  console.log(`✅ Meeting Room Welldone Tech Park isLive set to true (modified: ${mrResult.modifiedCount})`);

  console.log("\n=== All Welldone Listings are now LIVE! ===");
  process.exit(0);
}

publish().catch(err => {
  console.error("Publish failed:", err);
  process.exit(1);
});
