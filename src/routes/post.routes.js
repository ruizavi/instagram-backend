import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import { createPost } from "../controllers/post.controller.js";

const router = Router();

router.post("/post", authenticate, upload.array("resource", 8), createPost);

export default router;
