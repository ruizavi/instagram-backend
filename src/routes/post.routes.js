import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addVote,
  createPost,
  listPosts,
  removeVote,
  viewComment,
  viewPost,
} from "../controllers/post.controller.js";

const router = Router();

/**
 * url: /api/v1/post/
 * method: POST
 * body:
 *  - media: file[]
 *  - description: string
 *
 * headers:
 *  - Authorization: Bearer {token}
 *
 * response:
 *  - status: 203
 */
router.post("/", authenticate, upload.array("media", 8), createPost);
router.get("/", authenticate, listPosts);

router.get("/:id", authenticate, viewPost);

router.post("/:id/comment", authenticate, addComment);
router.get("/:id/comment", authenticate, viewComment);

router.get("/:id/vote", authenticate, addVote);
router.get("/:id/unvote", authenticate, removeVote);

export default router;
