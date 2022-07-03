import { Router } from "express";

import { postLogin, postLogout } from "../controllers/authController.js";

const router = Router();

router
    .post("/login", postLogin)
    .post("/logout", postLogout);

export default router;
