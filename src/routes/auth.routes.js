import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/test", authenticate, (req, res, next) => {
  res.json(req.user);
});

export default router;
