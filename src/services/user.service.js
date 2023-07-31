import prisma from "../prisma.js";

const regex = /(=?(.mp4))/;

const viewProfileService = async (id, domain) => {
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
    posts: profile.posts
      .filter((post) => !regex.test(post.media[0].resource))
      .map((post) => ({
        id: post.id,
        media: `http://${domain}/images/${post.media[0].resource}`,
      })),
    countPosts: profile.posts.length,
    countFollowing,
    countFollower,
  };
};

export { viewProfileService };
