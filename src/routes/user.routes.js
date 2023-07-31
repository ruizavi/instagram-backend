import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  viewProfile,
  followUser,
  viewPost,
  viewFollowers,
  viewFollowing,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/:id?/post/:post?", authenticate, viewPost);
router.get("/:id/follow", authenticate, followUser);
router.get("/:id?", authenticate, viewProfile);
router.get("/:id?/followers", authenticate, viewFollowers);
router.get("/:id?/followings", authenticate, viewFollowing);

export default router;
