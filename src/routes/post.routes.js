import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addVote,
  createPost,
  listPosts,
  viewComment,
  viewPost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/", authenticate, upload.array("media", 8), createPost);
router.get("/", authenticate, listPosts);

router.get("/:id", authenticate, viewPost);

router.post("/:id/comment", authenticate, addComment);
router.get("/:id/comment", authenticate, viewComment);

router.get("/:id/vote", authenticate, addVote);

export default router;
