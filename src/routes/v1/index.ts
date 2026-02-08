import { Router } from "express";

import bookRoutes from "./book";

const router = Router();

router.use("/books", bookRoutes);

export default router;
