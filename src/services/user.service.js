import prisma from "../prisma.js";

const viewProfileService = async (id) => {
  const Id = Number(id);

  const profile = await prisma.user.findUnique({
    where: { id: Number(Id) },
    include: { profile: true, posts: { include: { media: true } } },
  });

  const countFollowing = await prisma.follower.count({
    where: {
      followerID: Id,
    },
  });

  const countFollower = await prisma.follower.count({
    where: {
      followingID: Id,
    },
  });

  return {
    username: profile.username,
    name: profile.profile.firstName + " " + profile.profile.lastName,
    photo: profile.profile.photo,
    posts: profile.posts.map((post) => ({
      id: post.id,
      media: post.media[0],
    })),
    countPosts: profile.posts.length,
    countFollowing,
    countFollower,
  };
};

export { viewProfileService };
