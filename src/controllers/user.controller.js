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

export { viewProfile, followUser };
