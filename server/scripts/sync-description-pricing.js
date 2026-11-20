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

const DESC_UPDATES = [
  {
    slug: "get-set-office-virtual-office-sector-63-noida",
    gst: "10,499",
    comp: "11,499",
    mail: "9,499",
    sign: "2,999"
  },
  {
    slug: "get-set-office-virtual-office-green-park-delhi",
    gst: "11,499",
    comp: "12,499",
    mail: "10,499",
    sign: "3,499"
  },
  {
    slug: "get-set-office-virtual-office-sector-38-gurugram",
    gst: "11,299",
    comp: "12,299",
    mail: "10,299",
    sign: "3,499"
  },
  {
    slug: "ivantage-virtual-office-welldone-tech-park-gurgaon",
    gst: "11,999",
    comp: "12,999",
    mail: "10,999",
    sign: "3,999"
  },
  {
    slug: "reeon-spaces-virtual-office-central-square-delhi",
    gst: "10,999",
    comp: "11,999",
    mail: "9,999",
    sign: "2,999"
  }
];

async function syncDescriptions() {
  const rawUri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    const alt = getEffectiveUri(rawUri);
    await mongoose.connect(alt, { serverSelectionTimeoutMS: 8000 });
  }

  const db = mongoose.connection;
  const listingsCol = db.collection("marketplace_listings");

  for (const item of DESC_UPDATES) {
    const listing = await listingsCol.findOne({ slug: item.slug });
    if (!listing || !listing.description) continue;

    let desc = listing.description;

    // GSO and i-VANTAGE pattern
    desc = desc.replace(
      /- \*\*Virtual Office for GST Registration:\*\* \*\*₹[0-9,]+ \/ year \+ GST\*\*/g,
      `- **Virtual Office for GST Registration:** **₹${item.gst} / year + GST**`
    );
    desc = desc.replace(
      /- \*\*Virtual Office for Company Registration \(MCA \/ RoC\):\*\* \*\*₹[0-9,]+ \/ year \+ GST\*\*/g,
      `- **Virtual Office for Company Registration (MCA / RoC):** **₹${item.comp} / year + GST**`
    );
    desc = desc.replace(
      /- \*\*Virtual Office for Business Mailing Address:\*\* \*\*₹[0-9,]+ \/ year \+ GST\*\*/g,
      `- **Virtual Office for Business Mailing Address:** **₹${item.mail} / year + GST**`
    );
    desc = desc.replace(
      /- \*\*Permanent Physical Signage Board( Display)?:\*\* \*\*₹[0-9,]+ \/ year \+ GST\*\*/g,
      `- **Permanent Physical Signage Board:** **₹${item.sign} / year + GST**`
    );

    // REEON SPACES pattern
    desc = desc.replace(
      /GST Registration Virtual Office: ₹[0-9,]+ per year \+ GST\./g,
      `GST Registration Virtual Office: ₹${item.gst} per year + GST.`
    );
    desc = desc.replace(
      /Company Registration Virtual Office: ₹[0-9,]+ per year \+ GST\./g,
      `Company Registration Virtual Office: ₹${item.comp} per year + GST.`
    );
    desc = desc.replace(
      /Business Mailing Address: ₹[0-9,]+ per year \+ GST\./g,
      `Business Mailing Address: ₹${item.mail} per year + GST.`
    );
    desc = desc.replace(
      /Permanent Physical Signage Board: ₹[0-9,]+ per year \+ GST\./g,
      `Permanent Physical Signage Board: ₹${item.sign} per year + GST.`
    );

    await listingsCol.updateOne(
      { _id: listing._id },
      { $set: { description: desc, updatedAt: new Date() } }
    );
    console.log(`Synced description pricing for: ${item.slug}`);
  }

  console.log("=== All description sync complete ===");
  process.exit(0);
}

syncDescriptions().catch(err => {
  console.error(err);
  process.exit(1);
});
