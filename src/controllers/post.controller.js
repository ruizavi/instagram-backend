import prisma from "../prisma.js";
import { createPostService } from "../services/post.service.js";
import { NewComment } from "../validations/Post.js";

async function createPost(req, res, next) {
  const user = req.user;
  const files = req.file;
  const description = req.body.description;
  
  try {
    const post = await createPostService({
      description,
      media: files,
      user: user.id,
    });

    res.json(post);
  } catch (error) {
    console.log(error);
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = posts.map((post) => ({
      id: post.id,
      userID: post.userID,
      username: post.user.username,
      photo:
        post.profile.photo === null
          ? null
          : `http://${req.get("host")}/images/${post.profile.photo}`,
      media: post.media.map(
        (media) => `http://${req.get("host")}/images/${media.resource}`
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

async function addComment(req, res, next) {
  const { id: userID } = req.user;
  const { id: postID } = req.params;
  const { comment } = req.body;

  try {
    const parsedBody = NewComment.parse({
      userID,
      postID: Number(postID),
      comment,
    });

    const newComment = await prisma.comment.create({
      data: {
        comment: parsedBody.comment,
        userID: parsedBody.userID,
        postID: parsedBody.postID,
      },
    });

    res.json(newComment);
  } catch (error) {
    next(error);
  }
}

async function viewComment(req, res, next) {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postID: Number(id) },
      include: {
        user: {
          include: { profile: { select: { photo: true } } },
        },
      },
    });

    const response = comments.map((c) => ({
      id: c.id,
      userID: c.user.id,
      photo:
        c.user.profile.photo === null
          ? null
          : `http://${req.get("host")}/images/${c.user.profile.photo}`,
      username: c.user.username,
      content: c.comment,
      createAt: c.createdAt,
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function addVote(req, res, next) {
  const { id: postID } = req.params;
  const { id: userID } = req.user;

  try {
    const vote = await prisma.vote.findUnique({
      where: { postID_userID: { postID: Number(postID), userID } },
    });

    if (vote === null) {
      await prisma.vote.create({
        data: {
          postID: Number(postID),
          userID,
        },
      });

      return res.json({ isVoted: true });
    }

    await prisma.vote.delete({
      where: { postID_userID: { postID: Number(postID), userID } },
    });

    res.json({ isVoted: false });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function viewPost(req, res, next) {
  const id = Number(req.params.id);
  const user = req.user;
  try {
    const posts = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: { select: { username: true } },
        profile: { select: { photo: true } },
        media: { select: { resource: true } },
        comments: { include: { user: { include: { profile: true } } } },
        votes: true,
      },
    });

    res.json({
      id: posts.id,
      username: posts.user.username,
      photo:
        posts.profile.photo === null
          ? null
          : `http://${req.get("host")}/images/${posts.profile.photo}`,
      comments: posts.comments.map((c) => ({
        username: c.user.username,
        photo: c.user.profile.photo,
        comment: c.comment,
        id: c.id,
      })),
      media: posts.media.map(
        (media) => `http://${req.get("host")}/images/${media.resource}`
      ),
      description: posts.body,
      date: posts.createdAt,
      votes: posts.votes.length,
      isVoted: posts.votes.some((v) => v.userID === user.id),
    });
  } catch (error) {
    next(error);
  }
}

export { createPost, listPosts, addComment, viewComment, addVote, viewPost };
