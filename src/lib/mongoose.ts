import mongoose from "mongoose";

// types
import type { ConnectOptions } from "mongoose";

// self modules
import config from "../config";
// import { logger } from '@/lib/winston';

const clientOptions: ConnectOptions = {
  dbName: "bookstore",
  appName: "Bookstore API",
  // serverApi: {
  //     version: '1',
  //     strict: true,
  //     deprecationErrors: true,
  // },
};

export const connectDb = async (): Promise<void> => {
  if (!config.MONGODB_URI) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    console.log("DEBUG: ", config.MONGODB_URI, clientOptions);
    await mongoose.connect(config.MONGODB_URI, clientOptions);
    console.log("DATABASE connected!", {
      uri: config.MONGODB_URI,
      options: clientOptions,
    });
    // logger.info('DATABASE connected!', {
    //     uri: config.MONGODB_URI,
    //     options: clientOptions,
    // });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    console.error("Error connecting to database: ", err);
    // logger.error('Error connecting to database: ', err);
  }
};

export const disconnectFromDb = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from DB successfully! ", {
      uri: config.MONGODB_URI,
      options: clientOptions,
    });
    // logger.info('Disconnected from DB successfully! ', {
    //     uri: config.MONGODB_URI,
    //     options: clientOptions,
    // });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    console.error("Error disconnecting from DB with error: ", err);
    // logger.error('Error disconnecting from DB with error: ', err);
  }
};
