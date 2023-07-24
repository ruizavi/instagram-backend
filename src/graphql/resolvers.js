import prisma from "../prisma.js";

export const Queries = {
  user: async (parent, args, contextValue, info) => {
    const { id } = contextValue.user;

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        profile: true,
        follower: true,
        followings: true,
        posts: true,
      },
    });

    const profile = {
      ...user.profile,
      noOfFollowings: user.follower.length,
      noOfFollowers: user.followings.length,
      noOfPosts: user.posts.length,
    };

    return {
      ...user,
      profile,
    };
  },
  posts: async (parent, args, contextValue, info) => {
    const { id } = contextValue.user;

    const post = await prisma.post.findMany({
      where: { userID: id },
      include: { media: true },
    });

    const posts = post.map((p) => ({
      ...p,
      media: p.media.map((m) => ({
        ...m,
        resource: Buffer.from(m.resource).toString("base64"),
      })),
    }));

    return posts;
  },
};

export const resolvers = {
  Query: Queries,
};
