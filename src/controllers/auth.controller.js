import { signinService, signupService } from "../services/auth.service.js";

/**
 *
 * @param {*} req
 * @param {import("express").Response} res
 * @param {*} next
 */
async function signup(req, res, next) {
  const body = req.body;
  try {
    await signupService(body);
    
    res.sendStatus(203);
  } catch (error) {
    next(error);
  }
}

/**
 *
 * @param {*} req
 * @param {import("express").Response} res
 * @param {*} next
 */
async function signin(req, res, next) {
  const body = req.body;
  try {
    const token = await signinService(body);

    return res.json({ token: token });
  } catch (error) {
    next(error);
  }
}

export { signup, signin };
