import type { loginScheme } from "./auth.scheme.js";
import type { z } from "zod";

export type LoginInput = z.infer<typeof loginScheme>;
