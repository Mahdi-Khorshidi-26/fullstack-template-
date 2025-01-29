export const Query = {
  // List of all entities
  posts: async (parent, args, { prisma, user }) => {
    const posts = await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    return posts;
  },
  users: async (parent, args, { prisma, user }) => {
    const users = await prisma.user.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    return users;
  },
  profiles: async (parent, args, { prisma, user }) => {
    const profiles = await prisma.profile.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
    return profiles;
  },
  // Single entity by ID
  post: async (parent, { id }, { prisma, user }) => {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return post;
  },
  user: async (parent, { id }, { prisma, user }) => {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return foundUser;
  },
  profile: async (parent, { id }, { prisma, user }) => {
    const profile = await prisma.profile.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return profile;
  },
};
