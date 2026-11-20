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

const PRICING_UPDATES = [
  {
    slug: "get-set-office-virtual-office-sector-63-noida",
    name: "Get Set Office – Sector 63, Noida",
    basePrice: 9499,
    services: {
      "Virtual Office – GST Registration (NOIDA)": 10499,
      "Virtual Office – Company Registration (NOIDA)": 11499,
      "Virtual Office – Mailing Address (NOIDA)": 9499,
      "Permanent Signage Board (NOIDA)": 2999
    }
  },
  {
    slug: "get-set-office-virtual-office-green-park-delhi",
    name: "Get Set Office – Green Park, South Delhi",
    basePrice: 10499,
    services: {
      "Virtual Office – GST Registration (DELHI)": 11499,
      "Virtual Office – Company Registration (DELHI)": 12499,
      "Virtual Office – Mailing Address (DELHI)": 10499,
      "Permanent Signage Board (DELHI)": 3499
    }
  },
  {
    slug: "get-set-office-virtual-office-sector-38-gurugram",
    name: "Get Set Office – Sector 38, Gurugram",
    basePrice: 10299,
    services: {
      "Virtual Office – GST Registration (GURGAON)": 11299,
      "Virtual Office – Company Registration (GURGAON)": 12299,
      "Virtual Office – Mailing Address (GURGAON)": 10299,
      "Permanent Signage Board (GURGAON)": 3499
    }
  },
  {
    slug: "reeon-spaces-virtual-office-central-square-delhi",
    name: "REEON SPACES – Central Square, Karol Bagh, Delhi",
    basePrice: 9999,
    services: {
      "Virtual Office – GST Registration (REEON SPACES)": 10999,
      "Virtual Office – Company Registration (REEON SPACES)": 11999,
      "Virtual Office – Mailing Address (REEON SPACES)": 9999,
      "Permanent Signage Board (REEON SPACES)": 2999
    }
  },
  {
    slug: "ivantage-virtual-office-welldone-tech-park-gurgaon",
    name: "i-VANTAGE Business Hub – Welldone Tech Park, Gurugram",
    basePrice: 10999,
    services: {
      "Virtual Office – GST Registration (i-VANTAGE Business Hub)": 11999,
      "Virtual Office – Company Registration (i-VANTAGE Business Hub)": 12999,
      "Virtual Office – Mailing Address (i-VANTAGE Business Hub)": 10999,
      "Permanent Signage Board (i-VANTAGE Business Hub)": 3999
    }
  },
  {
    slug: "founders-quest-spaces-virtual-office-saket-delhi",
    name: "Founders Quest Spaces – Saket, South Delhi",
    basePrice: 9999,
    services: {
      "Virtual Office – GST Registration": 10999,
      "Virtual Office – Company Registration": 11999,
      "Virtual Office – Mailing Address": 9999,
      "Permanent Signage Board": 3499
    }
  }
];

async function updatePricing() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    const alt = getEffectiveUri(rawUri);
    await mongoose.connect(alt, { serverSelectionTimeoutMS: 8000 });
  }

  console.log("=== Connected to MongoDB ===");
  const db = mongoose.connection;
  const listingsCol = db.collection("marketplace_listings");
  const servicesCol = db.collection("marketplace_services");

  for (const item of PRICING_UPDATES) {
    console.log(`\nUpdating [${item.slug}]...`);
    const listing = await listingsCol.findOne({ slug: item.slug });
    if (!listing) {
      console.warn(`Listing not found: ${item.slug}`);
      continue;
    }

    // 1. Update services
    if (listing.serviceIds && listing.serviceIds.length) {
      for (const serviceId of listing.serviceIds) {
        const s = await servicesCol.findOne({ _id: serviceId });
        if (!s) continue;
        const newPrice = item.services[s.name];
        if (newPrice !== undefined) {
          await servicesCol.updateOne(
            { _id: serviceId },
            { $set: { price: newPrice, updatedAt: new Date() } }
          );
          console.log(`  ✓ Updated service "${s.name}": ₹${s.price} -> ₹${newPrice}`);
        } else {
          console.log(`  - Unchanged service "${s.name}": ₹${s.price}`);
        }
      }
    }

    // 2. Update listing description if it contains old pricing text
    let newDesc = listing.description || "";
    newDesc = newDesc.replace(/Starting at just ₹[0-9,]+\/year/gi, `Starting at just ₹${item.basePrice.toLocaleString("en-IN")}/year`);
    newDesc = newDesc.replace(/from ₹[0-9,]+\/year/gi, `from ₹${item.basePrice.toLocaleString("en-IN")}/year`);
    newDesc = newDesc.replace(/₹6,000\/year/g, `₹${item.basePrice.toLocaleString("en-IN")}/year`);
    newDesc = newDesc.replace(/₹7,999\/year/g, `₹${item.basePrice.toLocaleString("en-IN")}/year`);

    // 3. Update listing pricing
    await listingsCol.updateOne(
      { _id: listing._id },
      {
        $set: {
          "pricing.basePrice": item.basePrice,
          "pricing.currency": "INR",
          "pricing.unit": "per-year",
          description: newDesc,
          updatedAt: new Date()
        }
      }
    );
    console.log(`  ✓ Updated listing basePrice to ₹${item.basePrice}/year`);
  }

  console.log("\n=== All Virtual Office Pricing Updated Successfully! ===");
  process.exit(0);
}

updatePricing().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
