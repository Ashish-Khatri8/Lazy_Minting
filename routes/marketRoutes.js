
import { Router } from "express";

const router = Router();

import { getHome } from "../controllers/marketController.js";

router
    .get("/home", getHome);

export default router;
