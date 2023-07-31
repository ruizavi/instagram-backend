import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { viewProfile, followUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/:id?", authenticate, viewProfile);
router.get("/:id/follow", authenticate, followUser)

export default router;
