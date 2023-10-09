import { z } from "zod";

const SignUpBody = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_.!-]*$/),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/),
  fullname: z.string().regex(/^(?![\s.]+$)[a-zA-Z\s.]*$/),
});

const SignInBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

export { SignInBody, SignUpBody };
