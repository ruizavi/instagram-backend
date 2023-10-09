import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", authenticate, signout);

export default router;
