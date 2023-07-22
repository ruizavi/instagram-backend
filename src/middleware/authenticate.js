import * as jose from "jose";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (header == undefined) throw new Error("No cabecera");

    const token = header.replace("Bearer ", "");

    const payload = jwt.decode(token);

    const session = await prisma.session.findUniqueOrThrow({
      where: {
        destination_userID: {
          destination: payload.aud,
          userID: Number(payload.sub),
        },
      },
    });

    const signedToken = jwt.verify(token, session.hash);

    const user = await prisma.user.findUnique({
      where: { id: signedToken.id },
    });

    req.user = user;
    res.locals.aud = session.destination;

    next();
  } catch (error) {
    next(error);
  }
}

export default authenticate;
