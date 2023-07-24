import {
  signinService,
  signoutService,
  signupService,
} from "../services/auth.service.js";

async function signup(req, res, next) {
  const body = req.body;
  try {
    await signupService(body);

    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
}

async function signin(req, res, next) {
  const body = req.body;
  try {
    const token = await signinService(body);

    res.json({ token: token });
  } catch (error) {
    console.log(error);
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
