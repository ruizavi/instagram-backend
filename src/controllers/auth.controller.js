import {
  signinService,
  signoutService,
  signupService,
} from "../services/auth.service.js";

async function signup(req, res, next) {
  const body = req.body;
  const data = { ...body, photo: req.file };
  try {
    await signupService(data);

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
}

async function signin(req, res, next) {
  const body = req.body;

  try {
    const data = await signinService(body);

    res.json({ ...data, message: "Log In Successfully" });
  } catch (error) {
    next(error);
  }
}

async function signout(req, res, next) {
  const user = req.user;

  try {
    await signoutService(user.id, user.session.destination);

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
}

export { signup, signin, signout };
