import { mutationPrismaHelper } from "./dbFunctionHelper.js";
import { customGraphQLErrorHandler } from "./resolvers.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export const Mutation = {
  // Create a new entity
  createPost: async (
    _parent,
    { input: { title, content, published } },
    { prisma, user }
  ) => {
    const post = mutationPrismaHelper(prisma, "post", "create", {
      data: {
        title,
        content,
        published,
        authorId: 2,
      },
    });

    return post;
  },
  createUser: async (
    parent,
    { input: { name, email, password } },
    { prisma, user }
  ) => {
    console.log("user", user);
    if (!user) {
      customGraphQLErrorHandler("User not authenticated", "UNAUTHENTICATED");
    }
    if (!validator.isEmail(email)) {
      customGraphQLErrorHandler("Invalid email", "INVALID_EMAIL");
    }
    if (password.length < 8) {
      customGraphQLErrorHandler(
        "Password must be at least 8 characters",
        "PASSWORD_TOO_SHORT"
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = mutationPrismaHelper(prisma, "user", "create", {
      data: {
        id: 2,
        name,
        email,
        password: hashedPassword,
      },
    });
    return createdUser;
  },
  createProfile: async (parent, { input: { bio } }, { prisma, user }) => {
    const profile = mutationPrismaHelper(prisma, "profile", "create", {
      data: {
        bio,
        userId: 3,
      },
    });

    return profile;
  },
  // Update an entity
  updatePost: async (parent, { id, input }, { prisma, user }) => {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!post) {
      customGraphQLErrorHandler("Post not found", "POST_NOT_FOUND");
    }
    const updatedPost = mutationPrismaHelper(prisma, "post", "update", {
      where: {
        id: parseInt(id),
      },
      data: input,
    });
    return updatedPost;
  },
  updateUser: async (parent, { id, input }, { prisma, user }) => {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!foundUser) {
      customGraphQLErrorHandler("User not found", "USER_NOT_FOUND");
    }
    const updatedUser = mutationPrismaHelper(prisma, "user", "update", {
      where: {
        id: parseInt(id),
      },
      data: input,
    });
    return updatedUser;
  },
  updateProfile: async (parent, { id, input }, { prisma, user }) => {
    const profile = await prisma.profile.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!profile) {
      customGraphQLErrorHandler("Profile not found", "PROFILE_NOT_FOUND");
    }
    const updatedProfile = mutationPrismaHelper(prisma, "profile", "update", {
      where: {
        id: parseInt(id),
      },
      data: input,
    });
    return updatedProfile;
  },
  // Delete an entity
  deletePost: async (parent, { id }, { prisma, user }) => {
    const deletedPost = mutationPrismaHelper(prisma, "post", "delete", {
      where: {
        id: parseInt(id),
      },
    });

    return deletedPost;
  },
  deleteUser: async (parent, { id }, { prisma, user }) => {
    const deletedUser = mutationPrismaHelper(prisma, "user", "delete", {
      where: {
        id: parseInt(id),
      },
    });
    return deletedUser;
  },
  deleteProfile: async (parent, { id }, { prisma, user }) => {
    const deletedProfile = mutationPrismaHelper(prisma, "profile", "delete", {
      where: {
        id: parseInt(id),
      },
    });
    return deletedProfile;
  },
};
