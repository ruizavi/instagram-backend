import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (header == undefined) throw new Error("No cabecera");

    const token = header.replace("Bearer ", "");

    const payload = jwt.decode(token);

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
    });

    jwt.verify(token, user.hash);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

export default authenticate;
