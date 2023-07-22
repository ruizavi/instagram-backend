import { z } from "zod";

const SignUpBody = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_.!-]*$/),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*]).{8,}$/),
  firstName: z
    .string()
    .regex(/^[a-zA-Z/s]*$/),
  lastName: z
    .string()
    .regex(/^[a-zA-Z/s]*$/),
  bio: z.string().optional(),
  photo: z.any().optional(),
});

const SignInBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

export { SignInBody, SignUpBody };
