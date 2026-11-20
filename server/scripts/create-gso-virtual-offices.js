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
  let voCategory = await categoriesCol.findOne({ slug: "virtual-office" });
  if (!voCategory) {
    console.log("Virtual Office category not found, creating it...");
    const catRes = await categoriesCol.insertOne({
      name: "Virtual Office",
      slug: "virtual-office",
      icon: "Globe",
      sortOrder: 7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    voCategory = { _id: catRes.insertedId, name: "Virtual Office", slug: "virtual-office" };
  }
  console.log(`Using Virtual Office Category: ${voCategory._id} (${voCategory.name})`);

  // 2. Fetch existing media and amenities from GSO listings
  const existingGsoNoida = await listingsCol.findOne({ _id: new mongoose.Types.ObjectId("6ad33625c819b22e96514025") });
  const existingGsoDelhi = await listingsCol.findOne({ _id: new mongoose.Types.ObjectId("6af34954f6a11ce79e3635ab") });
  const existingGsoGurgaon = await listingsCol.findOne({ _id: new mongoose.Types.ObjectId("6af34e83f6a11ce79e363adf") });

  const defaultVendorId = new mongoose.Types.ObjectId("6ad33004c819b22e96514018");
  const adminId = new mongoose.Types.ObjectId("6aabd8a7eddc3ad3e3134d27");

  // Standard VO Amenities
  const allAmenities = await amenitiesCol.find({}).toArray();
  const defaultAmenityIds = allAmenities.map(a => a._id);

  // 3. Define the 3 GSO Virtual Office specifications
  const gsoOffices = [
    {
      code: "NOIDA",
      city: "noida",
      area: "Sector 63, Noida",
      address: "First Floor, B-85, Sector-63, Noida, Gautam Buddha Nagar, Uttar Pradesh – 201301",
      title: "Get Set Office – Premium Virtual Office in Sector 63, Noida",
      slug: "get-set-office-virtual-office-sector-63-noida",
      capacity: 50, // "jo ye seatss ki inventory h jo ki seating capacity vo hi virtual office me same rkhni hai" (Noida Seat = 50)
      basePrice: 6000, // Row 10 Virtual Office = 6000
      unit: "per-year",
      media: existingGsoNoida?.media || [],
      metro: "5-min walk from Sector 62 Metro Station (Blue Line)",
      description: `## Premium Virtual Office in Sector 63, Noida – Get Set Office

Establish your business presence in the prime commercial corridor of Delhi-NCR at **Get Set Office – Noida**, strategically situated at **B-85, Sector-63, Noida, Uttar Pradesh – 201301**. Located just a convenient 5-minute walk from the **Noida Sector 62 Blue Line Metro Station**, this Grade A business hub offers unparalleled prestige and connectivity for startups, expanding enterprises, and remote corporations.

Get Set Office provides a 100% legally compliant, fast-track Virtual Office solution designed specifically for **GST Registration**, **MCA / RoC Company Incorporation**, and **Corporate Business Mailing Address** services.

---

### Key Virtual Office Solutions & Annual Pricing

- **Virtual Office for GST Registration:** **₹6,000 / year + GST**  
  Obtain a verified commercial business address in Noida, Gautam Buddha Nagar for new GST registration or multi-state GST APOB expansion. Includes Landlord NOC, commercial electricity bill, and desk sharing documentation.
  
- **Virtual Office for Company Registration (MCA / RoC):** **₹6,999 / year + GST**  
  Ideal for incorporating a Private Limited Company, LLP, OPC, or Partnership firm with the Ministry of Corporate Affairs (MCA). 100% compliant with all statutory RoC filing requirements.

- **Virtual Office for Business Mailing Address:** **₹5,499 / year + GST**  
  Use a prestigious Sector-63, Noida corporate address on your invoices, visiting cards, website, and promotional materials. Includes dedicated mail and courier handling with digital notifications.

- **Permanent Physical Signage Board:** **₹3,499 / year + GST**  
  Prominently showcase your company name and GSTIN on the center's official directory board for mandatory statutory compliance and seamless on-ground tax inspections.

---

### Complete Compliance & Documentation Support
We deliver full verified documentation within 24–48 hours:
- Valid Commercial Rent Agreement / Lease Agreement
- Landlord No Objection Certificate (NOC)
- Latest Commercial Electricity / Utility Bill
- Desk Sharing / Seat Agreement
- Full on-ground support for GST Officer & Banking physical verification visits

---

### Prime Strategic Location & Connectivity
- **Address:** First Floor, B-85, Sector-63, Noida, Gautam Buddha Nagar, Uttar Pradesh – 201301
- **Metro Connectivity:** 5-minute walk from Sector 62 Metro Station (Blue Line) with direct links to Delhi, Ghaziabad, and Greater Noida.
- **On-Demand Infrastructure:** Access to executive meeting rooms, conference facilities, high-speed Wi-Fi, and cafeteria when you or your clients visit.`
    },
    {
      code: "DELHI",
      city: "delhi",
      area: "Yusuf Sarai, Green Park",
      address: "Commercial Complex, 400A, 4th Floor, 12 Ajit Singh House, Yusuf Sarai, Green Park, New Delhi, Delhi – 110016",
      title: "Get Set Office – Premium Virtual Office in Green Park, South Delhi",
      slug: "get-set-office-virtual-office-green-park-delhi",
      capacity: 20, // "jo ye seatss ki inventory h jo ki seating capacity vo hi virtual office me same rkhni hai" (Delhi Seat = 5-20 -> 20)
      basePrice: 6000, // Row 10 Virtual Office = 6000
      unit: "per-year",
      media: existingGsoDelhi?.media || existingGsoNoida?.media || [],
      metro: "2-min walk from Green Park & AIIMS Metro Stations (Yellow Line)",
      description: `## Premium Virtual Office in Green Park, South Delhi – Get Set Office

Elevate your corporate profile with an ultra-prestigious South Delhi commercial business address at **Get Set Office – Green Park**, situated at **Commercial Complex, 400A, 4th Floor, 12 Ajit Singh House, Yusuf Sarai, Green Park, New Delhi – 110016**. Centrally positioned between **Green Park** and **AIIMS Metro Stations (Yellow Line)**, this landmark location gives your business the ultimate credibility in the capital.

Whether you are launching a high-growth startup, setting up an e-commerce brand, or expanding into Delhi with a new GST jurisdiction, Get Set Office delivers verified, hassle-free Virtual Office solutions for **GST Registration**, **MCA / RoC Company Incorporation**, and **Prime Business Mailing Address** needs.

---

### Key Virtual Office Solutions & Annual Pricing

- **Virtual Office for GST Registration:** **₹6,000 / year + GST**  
  Obtain a verified commercial business address in South Delhi for fresh GST registration or additional place of business (APOB). Includes Landlord NOC, commercial electricity bill, and desk sharing documentation.
  
- **Virtual Office for Company Registration (MCA / RoC):** **₹6,999 / year + GST**  
  Incorporate a Private Limited Company, LLP, or One Person Company with the Ministry of Corporate Affairs using a recognized South Delhi registered office address.

- **Virtual Office for Business Mailing Address:** **₹5,499 / year + GST**  
  Display a South Delhi business address on your website, official letterheads, and invoices with complete courier handling and reception support.

- **Permanent Physical Signage Board:** **₹3,499 / year + GST**  
  Official physical company name display on the directory board at the entrance for regulatory compliance and tax officer inspections.

---

### Complete Compliance & Documentation Support
All documents provided in 24–48 hours:
- Registered Commercial Lease / Rent Agreement
- Landlord No Objection Certificate (NOC)
- Latest Commercial Electricity / Utility Bill
- Desk Sharing / Seat Agreement
- Full on-ground support for GST Officer & Banking physical verification visits

---

### Prime Strategic Location & Connectivity
- **Address:** Commercial Complex, 400A, 4th Floor, 12 Ajit Singh House, Yusuf Sarai, Green Park, New Delhi – 110016
- **Metro Connectivity:** Walking distance from Green Park & AIIMS Metro Stations (Yellow Line), connecting directly to Connaught Place, Gurugram, and Central Government offices.
- **On-Demand Infrastructure:** Access to soundproof private meeting suites, AV conference rooms, high-speed 1Gbps internet, and executive business lounge.`
    },
    {
      code: "GURGAON",
      city: "gurugram",
      area: "Sector 38, Medicity, Near Medanta",
      address: "3rd Floor, Tower A, Eleven Bay (Formerly SAS Tower), Support Area, Medicity, Sector 38, Gurugram, Haryana – 122001",
      title: "Get Set Office – Premium Virtual Office in Sector 38, Gurugram",
      slug: "get-set-office-virtual-office-sector-38-gurugram",
      capacity: 25, // "jo ye seatss ki inventory h jo ki seating capacity vo hi virtual office me same rkhni hai" (Gurgaon Seat = 25)
      basePrice: 6000, // Row 10 Virtual Office = 6000
      unit: "per-year",
      media: existingGsoGurgaon?.media || existingGsoNoida?.media || [],
      metro: "Direct access from NH-48 / Rajiv Chowk and HUDA City Centre Metro",
      description: `## Premium Virtual Office in Sector 38, Gurugram – Get Set Office

Secure an elite corporate headquarters address in India's millennial city at **Get Set Office – Gurugram**, located on the **3rd Floor, Tower A, Eleven Bay (Formerly SAS Tower), Medicity, Sector 38, Gurugram – 122001**. Situated right adjacent to the landmark Medanta Medicity complex and minutes from **Rajiv Chowk (NH-48 Expressway)** and **Millennium City Centre Metro**, this location commands top-tier enterprise authority.

Get Set Office provides seamless, 100% compliant Virtual Office packages tailored for **GST Registration in Haryana**, **MCA / RoC Company Incorporation**, and **Premium Business Mailing Address** services.

---

### Key Virtual Office Solutions & Annual Pricing

- **Virtual Office for GST Registration:** **₹6,000 / year + GST**  
  Obtain a verified commercial business address in Gurugram, Haryana for state GST registration or e-commerce APOB. Includes Landlord NOC, commercial electricity bill, and desk sharing documentation.
  
- **Virtual Office for Company Registration (MCA / RoC):** **₹6,999 / year + GST**  
  Establish your corporate headquarters with a prestigious Gurugram address for RoC Delhi & Haryana filings. Fully compliant with INC-22 statutory norms.

- **Virtual Office for Business Mailing Address:** **₹5,499 / year + GST**  
  Prestigious Sector-38 Gurugram address for corporate branding, website, marketing, and client correspondence with prompt parcel handling.

- **Permanent Physical Signage Board:** **₹3,499 / year + GST**  
  Physical nameplate display on the center directory board for physical GST officer inspections and bank account verification.

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
- **Address:** 3rd Floor, Tower A, Eleven Bay (Formerly SAS Tower), Support Area, Medicity, Sector 38, Gurugram, Haryana – 122001
- **Road & Metro Connectivity:** 2-minute drive from Rajiv Chowk (NH-48 / Delhi-Jaipur Highway), quick access to Subhash Chowk, Sohna Road, and Millennium City Centre Metro Station.
- **On-Demand Infrastructure:** Access to executive cabins, conference suites, high-speed Wi-Fi, and visitor hospitality.`
    }
  ];

  for (const office of gsoOffices) {
    console.log(`\nProcessing ${office.code} (${office.city})...`);

    // 1. Create or update services for this office
    const serviceSpecs = [
      {
        name: `Virtual Office – GST Registration (${office.code})`,
        price: office.basePrice,
        unit: "year",
        size: "1-Company / GSTIN Registration",
        description: `Annual Virtual Office package for GST Registration at Get Set Office ${office.area}. Includes registered commercial address, Landlord NOC, electricity bill, and physical verification support.`
      },
      {
        name: `Virtual Office – Company Registration (${office.code})`,
        price: 6999,
        unit: "year",
        size: "1-Company RoC / MCA Incorporation",
        description: `Annual registered office address for Ministry of Corporate Affairs (MCA) and RoC Company Incorporation (Private Limited, LLP, OPC) at Get Set Office ${office.area}.`
      },
      {
        name: `Virtual Office – Mailing Address (${office.code})`,
        price: 5499,
        unit: "year",
        size: "Corporate Business Mailing Address",
        description: `Prestigious business address at Get Set Office ${office.area} for branding, website, invoices, and mail/courier reception.`
      },
      {
        name: `Permanent Signage Board (${office.code})`,
        price: 3499,
        unit: "year",
        size: "Physical Name Board Display",
        description: `Prominent display of your company name on the official center directory board at Get Set Office ${office.area}. Essential for GST officer inspection.`
      }
    ];

    const serviceIds = [];
    for (const spec of serviceSpecs) {
      const existingSvc = await servicesCol.findOne({ name: spec.name });
      if (existingSvc) {
        await servicesCol.updateOne({ _id: existingSvc._id }, {
          $set: {
            price: spec.price,
            unit: spec.unit,
            size: spec.size,
            description: spec.description,
            isActive: true,
            updatedAt: new Date()
          }
        });
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

    // 2. Upsert the Virtual Office Listing
    const listingPayload = {
      vendorId: defaultVendorId,
      title: office.title,
      slug: office.slug,
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
      updatedAt: new Date()
    };

    const existingListing = await listingsCol.findOne({ slug: office.slug });
    if (existingListing) {
      await listingsCol.updateOne(
        { _id: existingListing._id },
        { $set: listingPayload }
      );
      console.log(`✅ Updated existing listing [${office.code}]: ${office.slug} (Capacity: ${office.capacity}, Price: ₹${office.basePrice}/year)`);
    } else {
      listingPayload.createdAt = new Date();
      listingPayload.legacySlugs = [];
      const insRes = await listingsCol.insertOne(listingPayload);
      console.log(`🎉 Created new listing [${office.code}]: ${insRes.insertedId} | ${office.slug} (Capacity: ${office.capacity}, Price: ₹${office.basePrice}/year)`);
    }
  }

  // Final verification: Count VO listings in DB
  const totalVO = await listingsCol.find({ categoryId: voCategory._id }).toArray();
  console.log(`\n========================================`);
  console.log(`Total Virtual Office listings now in DB: ${totalVO.length}`);
  totalVO.forEach(l => {
    console.log(`- ${l.title}`);
    console.log(`  Slug: ${l.slug} | City: ${l.location?.city} | Capacity: ${l.capacity} | Price: ₹${l.pricing?.basePrice}/${l.pricing?.unit}`);
  });
  console.log(`========================================`);

  await db.close();
  process.exit(0);
}

run().catch(e => {
  console.error("Migration error:", e);
  process.exit(1);
});
