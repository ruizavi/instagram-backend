import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import authenticate from "../middleware/authenticate.js";
import prisma from "../prisma.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", authenticate, async (req, res, next) => {
  const user = req.user;
  const aud = res.locals.aud;

  await prisma.session.delete({
    where: { destination_userID: { destination: aud, userID: user.id } },
  });

  res.sendStatus(203);
});

router.get("/test", authenticate, (req, res) => {
  res.json("hola")
})

export default router;
