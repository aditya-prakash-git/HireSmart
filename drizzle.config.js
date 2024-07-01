/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:QdKk6Wl0xaIq@ep-damp-poetry-a5tkbrav.us-east-2.aws.neon.tech/hiresmart-db?sslmode=require',
    }
  };