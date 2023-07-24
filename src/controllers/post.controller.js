import { createPostService } from "../services/post.service.js";

async function createPost(req, res, next) {
  const user = req.user;
  const files = req.files;
  const description = req.body.body;

  const data = {
    description,
    media: files,
    user: user.id,
  };
  try {
    await createPostService(data);
  } catch (error) {
    next(error);
  }
}

export { createPost };
