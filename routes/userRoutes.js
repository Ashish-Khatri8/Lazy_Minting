import { Router } from "express";
import { getBuy, getMint, getNft, getNfts, postNftBuy, postMint, postSaleListed } from "../controllers/userController.js";

const router = Router();

router
    .get("/buy", getBuy)
    .get("/mint", getMint)
    .get("/nfts", getNfts)
    .get("/nfts/:id", getNft)
    .post("/buy/:id", postNftBuy)
    .post("/mint", postMint)
    .post("/nfts", postSaleListed);

export default router;
