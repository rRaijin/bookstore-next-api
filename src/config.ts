import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  PORT: string | number;
  NODE_ENV: string;
  MONGODB_URI: string;
  BASE_URL: string;
}

const config: IConfig = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
  BASE_URL: process.env.BASE_URL || "http://localhost",
};

export default config;
