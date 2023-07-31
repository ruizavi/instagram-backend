import prisma from "../prisma.js";
import { viewProfileService } from "../services/user.service.js";

const viewProfile = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  try {
    if (id !== undefined) {
      return res.json(await viewProfileService(id));
    }

    res.json(await viewProfileService(user.id));
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  try {
    const isFollowed = await prisma.follower.findUnique({
      where: {
        followerID_followingID: {
          followerID: user.id,
          followingID: Number(id),
        },
      },
    });

    if (isFollowed === null) {
      await prisma.follower.create({
        data: { followerID: user.id, followingID: Number(id) },
      });

      return res.json({ isFollowed: true });
    }

    await prisma.follower.delete({
      where: {
        followerID_followingID: {
          followerID: user.id,
          followingID: Number(id),
        },
      },
    });

    res.json({ isFollowed: false });
  } catch (error) {
    next(error);
  }
};

const viewPost = async (req, res, next) => {
  const { id, post } = req.params;
  const user = req.user;

  const userID = Number(id || user.id);

  try {
    const userPosts = await prisma.post.findMany({
      where: { userID },
      include: { user: true, media: true, profile: true, votes: true },
      orderBy: { createdAt: "asc" },
    });

    const currentIndex = userPosts.findIndex((p) => p.id === Number(post));

    if (currentIndex === -1) {
      throw new Error(
        "El ID de publicación especificado no corresponde a un post del usuario."
      );
    }

    const currentPost = userPosts[currentIndex];
    const previousPost = currentIndex > 0 ? userPosts[currentIndex - 1] : null;
    const nextPost =
      currentIndex < userPosts.length - 1 ? userPosts[currentIndex + 1] : null;

    res.json({
      previousPost: previousPost.id,
      currentPost: {
        id: currentPost.id,
        userID: currentPost.user.id,
        username: currentPost.user.username,
        photo:
          currentPost.profile.photo === null
            ? null
            : `http://${req.get("host")}/images/${currentPost.profile.photo}`,
        media: currentPost.media.map(
          (media) => `http://${req.get("host")}/images/${media.resource}`
        ),
        description: currentPost.body,
        date: currentPost.createdAt,
        votes: currentPost.votes.length,
        isVoted: currentPost.votes.some((v) => v.userID === user.id),
      },
      nextPost: nextPost.id,
    });
  } catch (error) {
    next(error);
  }
};

export { viewProfile, followUser, viewPost };
