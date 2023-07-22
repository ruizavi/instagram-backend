import prisma from "../prisma.js";

export const Queries = {
  user: async (id) => {
    const user = await prisma.user.findFirst({
      where: { id },
      include: { profile: true, posts: true },
    });

    return { ...user, profile: { ...user?.profile, posts: user?.posts } };
  },
};

export const resolvers = {
  Query: Queries,
};
