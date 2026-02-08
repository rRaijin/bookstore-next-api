import cors from "cors";
import express from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import { connectDb, disconnectFromDb } from "./lib/mongoose";
import config from "./config";

import v1router from "./routes/v1/index";

// import routerAuthor from "./routes/author.js";
import routerBook from "./routes/v1/book";
// import routerGenre from "./routes/genre.js";
// import routerUser from "./routes/user.js";
// import routerImages from "./routes/files.js";
// import routerNewspaper from "./routes/newspaper.js";
// import routerPublisher from "./routes/publisher.js";
// import routerTechnical from "./routes/technical.js";
// import routerTechnicalAuthors from "./routes/technical_authors.js";
// import loggerMiddleware from "../loggerMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["qwerty"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);

(async () => {
  try {
    await connectDb();
    app.get("/ping", (req, res) => res.json({ status: "ok" })); // for ELB checker
    app.use("/api/v1", v1router);
    // app.use(loggerMiddleware);
    // app.use("/uploads", express.static("uploads")); // предоставляется доступ ко всем медиа-файлам в папке uploads
    // app.use("/api/authors", routerAuthor);
    // app.use("/api/newspaper", routerNewspaper);
    // app.use("/api/publisher", routerPublisher);
    // app.use("/api/genres", routerGenre);
    // app.use("/api/users", routerUser);
    // app.use("/api/images", routerImages);
    // app.use("/api/technical", routerTechnical);
    // app.use("/api/technicalAuthors", routerTechnicalAuthors);

    app.listen(config.PORT, () => {
      console.log(
        `> Server listening at ${config.BASE_URL}:${config.PORT} as ${process.env.NODE_ENV}`,
      );
    });
  } catch (err) {
    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();
const handleServerShutdown = async () => {
  try {
    await disconnectFromDb();
    console.log("Server SHUTDOWN");
    process.exit(0);
  } catch (err) {
    console.log("Error during server shutdown: ", err);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);

// const CONNECTION_STRING = "mongodb://127.0.0.1:27017";
// const DATABASE_NAME = "bookstore";
// const LISTEN_PORT = 3001;
// const mongooseConnect = async () => {
//   await mongoose
//     .connect(`${CONNECTION_STRING}/${DATABASE_NAME}`)
//     .then(() => app.listen(LISTEN_PORT))
//     .then(() => console.log("Connection to DB..."))
//     .catch((error) => console.log("error with conn to DB: ", error));
// };
// await mongooseConnect();
// process.on("SIGINT", async () => {
//   await mongoose.disconnect();
//   console.log("Application ended work.");
//   process.exit();
// });
