import { Router } from "express";

import bookRoutes from "./book";
import authorRoutes from "./author";
import filesRoutes from "./files";
import genreRoutes from "./genre";
import newspaperRoutes from "./newspaper";
import userRoutes from "./user";

const router = Router();

router.use("/books", bookRoutes);
router.use("/author", authorRoutes);
router.use("/files", filesRoutes);
router.use("/genre", genreRoutes);
router.use("/newspaper", newspaperRoutes);
router.use("/user", userRoutes);

export default router;
