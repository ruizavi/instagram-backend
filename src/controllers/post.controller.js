import prisma from "../prisma.js";
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

async function listPosts(req, res, next) {
  const user = req.user;

  try {
    const followers = await prisma.follower.findMany({
      where: { followerID: user.id },
      select: { followingID: true },
    });

    const posts = await prisma.post.findMany({
      where: {
        AND: {
          userID: { in: [...followers.map((p) => p.followingID), user.id] },
          isPrivate: false,
        },
      },
      include: {
        user: { select: { username: true } },
        profile: { select: { photo: true } },
        media: { select: { resource: true } },
        comments: true,
        votes: true,
      },
    });

    const response = posts.map((post) => ({
      userID: post.userID,
      username: post.user.username,
      photo:
        post.profile.photo === null
          ? null
          : `${req.get("host")}/images/${post.profile.photo}`,
      media: post.media.map(
        (media) => `${req.get("host")}/images/${media.resource}`
      ),
      description: post.body,
      comments: post.comments.length,
      votes: post.votes.length,
      date: post.createdAt,
      isVoted: post.votes.some((v) => v.userID === user.id),
    }));
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export { createPost, listPosts };
