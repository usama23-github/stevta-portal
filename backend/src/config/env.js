import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : process.env.NODE_ENV === "staging"
    ? ".env.staging"
    : ".env.development";

dotenv.config({ path: envFile });

console.log(`Loaded environment: ${envFile}`);