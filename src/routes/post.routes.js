import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import { createPost } from "../controllers/post.controller.js";

const router = Router();

/**
 * url: /api/v1/post/
 *
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

export default router;
