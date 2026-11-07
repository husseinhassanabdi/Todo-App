// import { Db, MongoClient } from "mongodb";

// type MongoGlobal = typeof globalThis & {
//   mongoClientPromise?: Promise<MongoClient>;
// };

// const mongoGlobal = globalThis as MongoGlobal;

// function getMongoClientPromise(): Promise<MongoClient> {
//   if (mongoGlobal.mongoClientPromise) {
//     return mongoGlobal.mongoClientPromise;
//   }

//   const uri = process.env.MONGODB_URI;
//   if (!uri) {
//     throw new Error("MONGODB_URI must be set in .env.local.");
//   }

//   const clientPromise = new MongoClient(uri).connect();
//   if (process.env.NODE_ENV !== "production") {
//     mongoGlobal.mongoClientPromise = clientPromise;
//   }

//   return clientPromise;
// }

// export async function getDb(): Promise<Db> {
//   const client = await getMongoClientPromise();
//   return client.db(process.env.MONGODB_DB || "todo_app");
// }



import { Db, MongoClient } from "mongodb";

type MongoGlobal = typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

const mongoGlobal = globalThis as MongoGlobal;

function getMongoClientPromise(): Promise<MongoClient> {
  if (mongoGlobal.mongoClientPromise) {
    return mongoGlobal.mongoClientPromise;
  }

  const databaseType = process.env.DATABASE_TYPE || "atlas";
  const uri =
    databaseType === "local"
      ? process.env.LOCAL_MONGODB_URI || process.env.MONGODB_URI
      : process.env.ATLAS_MONGODB_URI ||
        process.env.MONGODB_URI_PRO ||
        process.env.MONGODB_URI;

  if (!uri) {
    const expectedVariables =
      databaseType === "local"
        ? "LOCAL_MONGODB_URI or MONGODB_URI"
        : "ATLAS_MONGODB_URI, MONGODB_URI_PRO, or MONGODB_URI";
    throw new Error(
      `MongoDB connection URI is missing. Set ${expectedVariables} in .env.local.`,
    );
  }

  const clientPromise = new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    mongoGlobal.mongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise();

  return client.db(process.env.MONGODB_DB || "todo_app");
}
