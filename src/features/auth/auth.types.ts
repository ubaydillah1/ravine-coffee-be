import type { LoginScheme, RegisterScheme } from "./auth.scheme.js";
import type { z } from "zod";

export type LoginInput = z.infer<typeof LoginScheme>;
export type RegisterInput = z.infer<typeof RegisterScheme>;
