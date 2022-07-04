
import { Router } from "express";

const router = Router();

import { getRoot, getHome } from "../controllers/marketController.js";

router
    .get("/", getRoot)
    .get("/home", getHome);

export default router;
