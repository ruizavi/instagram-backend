import prisma from "../prisma.js";
import { viewProfileService } from "../services/user.service.js";

const viewFollowers = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  const userID = Number(id || user.id);

  try {
    const followers = await prisma.follower.findMany({
      where: {
        followingID: userID,
      },
      include: { follower: { include: { profile: true } } },
    });

    res.json({
      followersCount: followers.length,
      followers: followers.map((f) => ({
        id: f.followerID,
        username: f.follower.username,
        photo: `http://${req.get("host")}/images/${f.follower.profile.photo}`,
        name: [f.follower.profile.firstName, f.follower.profile.lastName].join(
          " "
        ),
      })),
    });
  } catch (error) {
    next(error);
  }
};

const viewFollowing = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  const userID = Number(id || user.id);

  try {
    const followings = await prisma.follower.findMany({
      where: {
        followerID: userID,
      },
      include: { following: { include: { profile: true } } },
    });

    res.json({
      followingCount: followings.length,
      followers: followings.map((f) => ({
        id: f.followingID,
        username: f.following.username,
        photo: `http://${req.get("host")}/images/${f.following.profile.photo}`,
        name: [
          f.following.profile.firstName,
          f.following.profile.lastName,
        ].join(" "),
      })),
    });
  } catch (error) {
    next(error);
  }
};

const viewProfile = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;

  try {
    if (id !== undefined) {
      return res.json(await viewProfileService(id, req.get("host")));
    }

    res.json(await viewProfileService(user.id, req.get("host")));
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  try {
    if (user.id === Number(id))
      return res.json({ message: "it is not possible to follow yourself" });

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

    if (userPosts.length === 0) return res.json({ message: "Not posts" });

    let currentIndex = userPosts.findIndex((p) => p.id === Number(post));

    if (currentIndex === -1) currentIndex = 0;

    const currentPost = userPosts[currentIndex];
    const previousPost = currentIndex > 0 ? userPosts[currentIndex - 1] : null;
    const nextPost =
      currentIndex < userPosts.length - 1 ? userPosts[currentIndex + 1] : null;

    res.json({
      previousPost: previousPost?.id || null,
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
      nextPost: nextPost?.id || null,
    });
  } catch (error) {
    next(error);
  }
};

export { viewProfile, followUser, viewPost, viewFollowers, viewFollowing };
