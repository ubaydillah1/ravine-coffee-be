export const config = {
  port: process.env.PORT! ?? 5000,
  jwtSecret: process.env.JWT_SECRET!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY!,
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY!,
  NODE_ENV: process.env.NODE_ENV!,
};
