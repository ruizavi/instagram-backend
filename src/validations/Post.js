import { z } from "zod";

const NewPost = z.object({
  description: z.string(),
  media: z.any().array(),
  user: z.number(),
});

export { NewPost };
