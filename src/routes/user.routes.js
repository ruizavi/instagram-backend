import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  viewProfile,
  followUser,
  viewPost,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/:id?/post/:post?", authenticate, viewPost);
router.get("/:id?", authenticate, viewProfile);
router.get("/:id/follow", authenticate, followUser);

export default router;
