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

const updates = [
  {
    id: "6ad616edd4691004bf6ae1a4",
    title: "i-VANTAGE Business Hub | Coworking Day Pass – Sector 48, Sohna Road",
    slug: "ivantage-day-pass-sector-48",
    legacySlugs: [
      "i-vantage-business-hub-or-coworking-day-pass-in-gurgaon-or-coworking-day-pass-in-gurgaon-sector-48-sohna-road",
    ],
  },
  {
    id: "6ad614ecd4691004bf6ae182",
    title: "i-VANTAGE Business Hub | Coworking Space – Welldone Tech Park, Sector 48",
    slug: "ivantage-coworking-welldone-tech-park",
    legacySlugs: [
      "i-vantage-business-hub-or-coworking-space-in-welldone-tech-park-or-premium-coworking-space-in-gurgaon-sector-48-sohna-road",
    ],
  },
  {
    id: "6ad611d0d4691004bf6ae16b",
    title: "i-VANTAGE Business Hub | 6-Seater Meeting Room – Welldone Tech Park",
    slug: "ivantage-meeting-room-welldone-tech-park",
    legacySlugs: [
      "i-vantage-business-hub-or-on-demand-meeting-room-in-welldone-tech-park-or-6-seater-meeting-room-in-gurgaon",
    ],
  },
  {
    id: "6ad33625c819b22e96514025",
    title: "Get Set Office | Coworking Space – Sector 63, Noida",
    slug: "get-set-office-sector-63-noida",
    legacySlugs: [
      "get-set-office-sector-63-noida-or-premium-coworking-space-and-virtual-office",
    ],
  },
];

async function run() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  let connected = false;
  try {
    await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 6000 });
    connected = true;
  } catch (err) {
    const alt = getEffectiveUri(rawUri);
    await mongoose.connect(alt, { serverSelectionTimeoutMS: 8000 });
    connected = true;
  }

  console.log("Connected to MongoDB successfully");
  const collection = mongoose.connection.collection("marketplace_listings");

  for (const item of updates) {
    const query = { _id: new mongoose.Types.ObjectId(item.id) };
    const existing = await collection.findOne(query);
    if (!existing) {
      console.log(`Listing ${item.id} not found, skipping`);
      continue;
    }

    const mergedLegacy = Array.from(
      new Set([
        ...(existing.legacySlugs || []),
        ...(item.legacySlugs || []),
        existing.slug,
      ])
    ).filter((s) => s && s !== item.slug);

    const res = await collection.updateOne(query, {
      $set: {
        title: item.title,
        slug: item.slug,
        legacySlugs: mergedLegacy,
      },
    });

    console.log(`Updated [${item.id}]:`);
    console.log(`  New Title: ${item.title}`);
    console.log(`  New Slug:  ${item.slug}`);
    console.log(`  Legacy Slugs preserved: ${JSON.stringify(mergedLegacy)}`);
    console.log(`  Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log("Migration complete!");
  process.exit(0);
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
