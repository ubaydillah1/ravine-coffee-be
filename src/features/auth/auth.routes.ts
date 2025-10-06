import * as AuthContoller from "./auth.controller.js";
import { Router } from "express";

const router = Router();

// router.post("/register", AuthContoller.register);
router.post("/login", AuthContoller.login);

export default router;
