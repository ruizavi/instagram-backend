import { createPostService } from "../services/post.service.js";

async function createPost(req, res, next) {
  const user = req.user;
  const files = req.files;
  const description = req.body.description;

  try {
    const post = await createPostService({
      description,
      media: files,
      user: user.id,
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
}

export { createPost };
