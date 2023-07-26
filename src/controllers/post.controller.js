import prisma from "../prisma.js";
import { createPostService } from "../services/post.service.js";
import { NewComment } from "../validations/Post.js";

async function createPost(req, res, next) {
  const user = req.user;
  const files = req.files;
  const description = req.body.description;

  try {
    const post = await createPostService({
      description,
      media: files,
      user: user.id,
    });

    res.json(post);
  } catch (error) {
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
    });

    const response = posts.map((post) => ({
      userID: post.userID,
      username: post.user.username,
      photo:
        post.profile.photo === null
          ? null
          : `${req.get("host")}/images/${post.profile.photo}`,
      media: post.media.map(
        (media) => `${req.get("host")}/images/${media.resource}`
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
    const parsedBody = NewComment.parse({ userID, postID, comment });

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
      where: { postID: id },
      include: {
        user: {
          select: { username: true, id: true },
          include: { profile: { select: { photo: true } } },
        },
      },
    });

    const response = comments.map((c) => ({
      userID: c.user.id,
      photo:
        c.user.profile.photo === null
          ? null
          : `${req.get("host")}/images/${c.user.profile.photo}`,
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
    await prisma.vote.create({
      data: {
        postID,
        userID,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function removeVote(req, res, next) {
  const { id: postID } = req.params;
  const { id: userID } = req.user;

  try {
    await prisma.vote.delete({
      data: {
        postID,
        userID,
      },
    });
  } catch (error) {
    next(error);
  }
}

export { createPost, listPosts, addComment, viewComment, addVote, removeVote };
