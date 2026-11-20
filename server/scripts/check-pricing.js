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

async function check() {
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

  const voListings = await listingsCol.find({
    categoryId: new mongoose.Types.ObjectId("6afab5874a4f913dc56d2dc4")
  }).toArray();

  console.log(`Found ${voListings.length} VO listings:`);
  for (const l of voListings) {
    const services = await servicesCol.find({ _id: { $in: l.serviceIds || [] } }).toArray();
    console.log(`\n--- [${l.slug}] ---`);
    console.log(`Title: ${l.title}`);
    console.log(`Location: ${l.location?.city}, ${l.location?.address}`);
    console.log(`Pricing full:`, JSON.stringify(l.pricing));
    const lines = (l.description || "").split("\n").filter(line => /₹|price|pricing|plan|cost/i.test(line));
    console.log(`Pricing lines in description:`, lines);
    console.log(`Services (${services.length}):`);
    services.forEach(s => {
      console.log(`  - [${s._id}] ${s.name}: ₹${s.price} (${s.unit})`);
    });
  }

  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
