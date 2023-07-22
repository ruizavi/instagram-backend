import * as jose from "jose";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (header == undefined) throw new Error("No cabecera");

    const token = header.replace("Bearer ", "");

    const payload = jwt.decode(token);

    console.log({ destination: payload.aud, userID: Number(payload.sub) });

    const session = await prisma.session.findFirst({
      where: { AND: { destination: payload.aud, userID: Number(payload.sub) } },
    });

    const signedToken = jwt.verify(token, session.hash);

    const user = await prisma.user.findUnique({
      where: { id: signedToken.id },
    });

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
}

export default authenticate;
