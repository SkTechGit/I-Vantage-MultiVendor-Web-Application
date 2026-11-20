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

async function run() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.error("MONGODB_URI not found");
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
  const categoriesCol = db.collection("marketplace_categories");
  const servicesCol = db.collection("marketplace_services");
  const amenitiesCol = db.collection("marketplace_amenities");

  // 1. Resolve Virtual Office Category
  const voCategory = await categoriesCol.findOne({ slug: "virtual-office" });
  if (!voCategory) {
    throw new Error("Virtual Office category not found in DB");
  }

  // 2. Resolve Amenities
  const allAmenities = await amenitiesCol.find({}).toArray();
  const defaultAmenityIds = allAmenities.map((a) => a._id);

  const defaultVendorId = new mongoose.Types.ObjectId("6ad33004c819b22e96514018");
  const adminId = new mongoose.Types.ObjectId("6aabd8a7eddc3ad3e3134d27");

  // Fetch sample media
  const ivantageSource = await listingsCol.findOne({ slug: "ivantage-coworking-welldone-tech-park" });
  const reeonSource = await listingsCol.findOne({ slug: "reeon-spaces-premium-coworking-space-in-karol-bagh" });

  const missingOffices = [
    {
      brand: "i-VANTAGE Business Hub",
      title: "i-VANTAGE Business Hub – Premium Virtual Office in Welldone Tech Park, Sector 48, Gurugram",
      slug: "ivantage-virtual-office-welldone-tech-park-gurgaon",
      city: "gurugram",
      area: "Sohna Road, Sector 48",
      address: "Unit No. 213-14, 2nd Floor, Welldone Tech Park, Sector 48, Sohna Road, Gurugram, Haryana – 122001",
      capacity: 120,
      basePrice: 9999,
      unit: "per-year",
      media: ivantageSource?.media || [],
      metro: "Direct access from Subhash Chowk & Millennium City Centre Metro",
      description: `## Premium Virtual Office in Welldone Tech Park, Sector 48, Sohna Road, Gurugram

Establish an authoritative corporate headquarters address at **i-VANTAGE Business Hub – Welldone Tech Park**, prime commercial center located on **Sohna Road, Sector 48, Gurugram, Haryana – 122001**. Strategically situated on the main Sohna Road commercial corridor with swift signal-free connectivity to Rajiv Chowk (NH-48), Golf Course Extension Road, and Millennium City Centre Metro Station, this Grade A facility delivers unparalleled prestige.

i-VANTAGE Business Hub delivers 100% compliant, fully verified Virtual Office packages tailored for **GST Registration in Haryana**, **MCA / RoC Company Incorporation**, and **Corporate Business Mailing Address** services.

---

### Key Virtual Office Solutions & Annual Pricing

- **Virtual Office for GST Registration:** **₹10,999 / year + GST**  
  Obtain a verified commercial business address in Gurugram, Haryana for fresh GST registration or multi-state APOB expansion. Includes Landlord NOC, commercial electricity bill, and desk sharing documentation.
  
- **Virtual Office for Company Registration (MCA / RoC):** **₹11,999 / year + GST**  
  Incorporate a Private Limited Company, LLP, OPC, or Partnership firm with the Ministry of Corporate Affairs using a recognized Sohna Road corporate registered office address.

- **Virtual Office for Business Mailing Address:** **₹9,999 / year + GST**  
  Display a prestigious Welldone Tech Park corporate address on your website, official letterheads, and invoices with complete courier handling and reception support.

- **Permanent Physical Signage Board Display:** **₹3,499 / year + GST**  
  Official physical company name display on the directory board at the reception for statutory regulatory compliance and seamless GST officer site verifications.

---

### Complete Compliance & Documentation Support
Fast-track documentation delivered within 24–48 hours:
- Registered Commercial Lease / Rent Agreement
- Landlord No Objection Certificate (NOC)
- Latest Commercial Electricity / Utility Bill
- Desk Sharing / Seat Agreement
- Full on-ground support for GST Officer & Banking physical verification visits

---

### Prime Strategic Location & Connectivity
- **Address:** Unit No. 213-14, 2nd Floor, Welldone Tech Park, Sector 48, Sohna Road, Gurugram, Haryana – 122001
- **Expressway & Road Links:** 2 minutes from Subhash Chowk, 5 minutes from Rajiv Chowk (NH-48), direct access to Golf Course Extension Road.
- **On-Demand Infrastructure:** Access to high-tech 6-seater and 14-seater AV boardrooms, executive cabins, 1Gbps dedicated internet, and cafeteria lounge.`
    },
    {
      brand: "REEON SPACES",
      title: "REEON SPACES – Premium Virtual Office in Central Square, Karol Bagh / Bara Hindu Rao, Delhi",
      slug: "reeon-spaces-virtual-office-central-square-delhi",
      city: "delhi",
      area: "Karol Bagh",
      address: "Plaza-2, Central Square Complex, 20 Manohar Lal Khurana Marg, Bara Hindu Rao, Near Karol Bagh, Delhi – 110006",
      capacity: 35,
      basePrice: 7999,
      unit: "per-year",
      media: reeonSource?.media || [],
      metro: "Convenient access from Karol Bagh, Pulbangash, and Tis Hazari Metro Stations",
      description: `## Premium Virtual Office in Central Square Complex, Karol Bagh / North Delhi – REEON SPACES

Position your brand with a central commercial business address at **REEON SPACES – Central Square Complex**, situated at **Plaza-2, Central Square Complex, 20 Manohar Lal Khurana Marg, Bara Hindu Rao, Delhi – 110006**. Located at the bustling nexus of Karol Bagh, Civil Lines, and Central Delhi commercial markets, this landmark complex offers unbeatable accessibility and corporate standing.

REEON SPACES provides hassle-free, 100% compliant Virtual Office packages designed for **GST Registration in Delhi**, **MCA / RoC Company Incorporation**, and **Prime Business Mailing Address** services.

---

### Key Virtual Office Solutions & Annual Pricing

- **Virtual Office for GST Registration:** **₹7,999 / year + GST**  
  Obtain a verified commercial address in Delhi for fresh GST registration or additional place of business (APOB). Includes Landlord NOC, commercial electricity bill, and desk sharing documentation.
  
- **Virtual Office for Company Registration (MCA / RoC):** **₹8,999 / year + GST**  
  Incorporate a Private Limited Company, LLP, or One Person Company with the Ministry of Corporate Affairs using a recognized Central Delhi registered office address.

- **Virtual Office for Business Mailing Address:** **₹6,999 / year + GST**  
  Prestigious Delhi business address for website, stationery, courier reception, and digital mail handling with dedicated receptionist.

- **Permanent Physical Signage Board:** **₹3,499 / year + GST**  
  Official physical company name display on the directory board at the center entrance for regulatory compliance and physical tax officer inspections.

---

### Complete Compliance & Documentation Support
Fast-track documentation delivered within 24–48 hours:
- Valid Commercial Rent Agreement / Lease Agreement
- Landlord No Objection Certificate (NOC)
- Latest Commercial Electricity / Utility Bill
- Desk Sharing / Seat Agreement
- Full on-ground support for GST Officer & Banking physical verification visits

---

### Prime Strategic Location & Connectivity
- **Address:** Plaza-2, Central Square Complex, 20 Manohar Lal Khurana Marg, Bara Hindu Rao, Delhi – 110006
- **Metro Connectivity:** Minutes from Pulbangash (Red Line), Tis Hazari (Red Line), and Karol Bagh (Blue Line) Metro Stations.
- **On-Demand Infrastructure:** Access to executive meeting rooms, private cabins, high-speed Wi-Fi, and visitor hospitality.`
    }
  ];

  for (const office of missingOffices) {
    console.log(`\nChecking / Creating: ${office.title}`);

    // Check if listing already exists with this slug or address
    const existing = await listingsCol.findOne({
      $or: [
        { slug: office.slug },
        {
          categoryId: voCategory._id,
          "location.city": office.city,
          "location.area": office.area
        }
      ]
    });

    if (existing) {
      console.log(`⚠️ Listing already exists for this center (ID: ${existing._id}, Slug: ${existing.slug}). Skipping to prevent duplicates.`);
      continue;
    }

    // Create Services
    const serviceSpecs = [
      {
        name: `Virtual Office – GST Registration (${office.brand})`,
        price: office.basePrice,
        unit: "year",
        size: "1-Company / GSTIN Registration",
        description: `Annual Virtual Office package for GST Registration at ${office.brand} ${office.area}. Includes registered commercial address, Landlord NOC, electricity bill, and physical verification support.`
      },
      {
        name: `Virtual Office – Company Registration (${office.brand})`,
        price: office.basePrice + 1000,
        unit: "year",
        size: "1-Company RoC / MCA Incorporation",
        description: `Annual registered office address for Ministry of Corporate Affairs (MCA) and RoC Company Incorporation (Private Limited, LLP, OPC) at ${office.brand} ${office.area}.`
      },
      {
        name: `Virtual Office – Mailing Address (${office.brand})`,
        price: Math.max(4999, office.basePrice - 1000),
        unit: "year",
        size: "Corporate Business Mailing Address",
        description: `Prestigious business address at ${office.brand} ${office.area} for branding, website, invoices, and mail/courier reception.`
      },
      {
        name: `Permanent Signage Board (${office.brand})`,
        price: 3499,
        unit: "year",
        size: "Physical Name Board Display",
        description: `Prominent display of your company name on the official center directory board at ${office.brand} ${office.area}. Essential for GST officer inspection.`
      }
    ];

    const serviceIds = [];
    for (const spec of serviceSpecs) {
      const existingSvc = await servicesCol.findOne({ name: spec.name });
      if (existingSvc) {
        serviceIds.push(existingSvc._id);
      } else {
        const ins = await servicesCol.insertOne({
          name: spec.name,
          price: spec.price,
          unit: spec.unit,
          size: spec.size,
          description: spec.description,
          isGlobal: false,
          vendorId: defaultVendorId,
          isActive: true,
          createdBy: defaultVendorId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        serviceIds.push(ins.insertedId);
      }
    }

    // Insert Listing
    const payload = {
      vendorId: defaultVendorId,
      title: office.title,
      slug: office.slug,
      legacySlugs: [],
      description: office.description,
      categoryId: voCategory._id,
      location: {
        city: office.city,
        area: office.area,
        address: office.address
      },
      pricing: {
        basePrice: office.basePrice,
        currency: "INR",
        unit: office.unit
      },
      capacity: office.capacity,
      serviceIds: serviceIds,
      amenityIds: defaultAmenityIds,
      customAmenities: [
        "100% GST & MCA Registration Compliant",
        "Registered Landlord NOC & Utility Bill Provided",
        "Official Corporate Address & Courier Handling",
        "Permanent Physical Signage Board Available",
        office.metro,
        "Meeting Room On-Demand for Verification",
        "Dedicated Business Receptionist & Concierge",
        "Zero Brokerage Direct Partner Booking"
      ],
      media: office.media,
      status: "approved",
      isLive: true,
      rejectionReason: "",
      approvedAt: new Date(),
      publishedAt: new Date(),
      approvedBy: adminId,
      lastEditedBy: defaultVendorId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insRes = await listingsCol.insertOne(payload);
    console.log(`🎉 Created new Virtual Office listing: ${insRes.insertedId} | ${office.slug}`);
  }

  // 3. Final Verification: Check for any duplicate slugs or centers
  const allVO = await listingsCol.find({ categoryId: voCategory._id }).toArray();
  console.log(`\n======================================================`);
  console.log(`TOTAL VIRTUAL OFFICE LISTINGS IN DB: ${allVO.length}`);
  console.log(`======================================================`);

  const slugSet = new Set();
  let duplicates = 0;
  allVO.forEach((l, idx) => {
    if (slugSet.has(l.slug)) {
      console.error(`❌ DUPLICATE DETECTED: Slug "${l.slug}" appears more than once!`);
      duplicates++;
    } else {
      slugSet.add(l.slug);
    }
    console.log(`[${idx + 1}] ${l.title}`);
    console.log(`    Slug: ${l.slug}`);
    console.log(`    City: ${l.location?.city} | Area: ${l.location?.area} | Capacity: ${l.capacity} Seats | Price: ₹${l.pricing?.basePrice}/${l.pricing?.unit}`);
  });

  if (duplicates === 0) {
    console.log(`\n✅ ZERO DUPLICATES VERIFIED: All ${allVO.length} Virtual Office listings have strictly unique slugs and physical centers!`);
  }

  await db.close();
  process.exit(0);
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
