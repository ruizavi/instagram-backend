import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  viewProfile,
  followUser,
  viewPost,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/:id?", authenticate, viewProfile);
router.get("/:id/follow", authenticate, followUser);
router.get("/:id?/post/:post?", authenticate, viewPost);

export default router;
