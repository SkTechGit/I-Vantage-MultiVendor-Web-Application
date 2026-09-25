import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // fallback silently if custom DNS cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Resolves SRV connection strings to direct replica set URIs to prevent
 * querySrv ECONNREFUSED issues on local Windows networks and restricted DNS resolvers.
 */
async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  // Fast direct resolution for the i-vantage Atlas cluster
  if (uri.includes("virtualoffice.sssb12s.mongodb.net")) {
    const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@virtualoffice\.sssb12s\.mongodb\.net\/(.*)$/);
    if (match) {
      const [, user, pass, rest] = match;
      const db = rest.split("?")[0] || "i-vantage";
      return `mongodb://${user}:${pass}@ac-4ypyhvm-shard-00-00.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-01.sssb12s.mongodb.net:27017,ac-4ypyhvm-shard-00-02.sssb12s.mongodb.net:27017/${db}?ssl=true&authSource=admin&replicaSet=atlas-on4dtu-shard-0`;
    }
  }

  // Generic SRV resolution fallback using Google Public DNS
  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    const srvMatch = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/\?]+)(.*)$/);
    if (srvMatch) {
      const [, user, pass, host, rest] = srvMatch;
      const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
      if (srvRecords && srvRecords.length > 0) {
        const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
        let txtParams = "";
        try {
          const txtRecords = await resolver.resolveTxt(host);
          txtParams = txtRecords.flat().join("&");
        } catch {
          // ignore
        }
        const delimiter = rest.includes("?") ? "&" : "?";
        return `mongodb://${user}:${pass}@${hosts}${rest || "/admin"}${txtParams ? `${delimiter}${txtParams}&ssl=true` : `${delimiter}ssl=true`}`;
      }
    }
  } catch {
    // Fall back to original URI if custom resolver fails
  }

  return uri;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = (async () => {
      const effectiveUri = await resolveMongoUri(MONGODB_URI);
      try {
        return await mongoose.connect(effectiveUri, opts);
      } catch (err) {
        // If connection with effectiveUri fails and it was different from raw URI, retry with raw
        if (effectiveUri !== MONGODB_URI) {
          return await mongoose.connect(MONGODB_URI, opts);
        }
        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

