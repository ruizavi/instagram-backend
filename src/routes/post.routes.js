import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";
import { createPost, listPosts } from "../controllers/post.controller.js";

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
// Carga posts para la vista principal del usuario
router.get("/", authenticate, listPosts)

router.get("/:id")

//Añadir comentario
router.post("/:id/comment")
//Lista comentarios de la publicacion
router.get("/:id/comment")

//Da me gusta a la publicacion
router.get("/:id/vote")
//Retira me gusta a la publicacion
router.get("/:id/unvote")



export default router;
