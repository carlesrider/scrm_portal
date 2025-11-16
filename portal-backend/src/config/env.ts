import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "SUITECRM_BASE_URL",
  "SUITECRM_CLIENT_ID",
  "SUITECRM_CLIENT_SECRET",
  "SUITECRM_GRANT_TYPE",
  "PORTAL_JWT_SECRET",
  "PORT"
] as const;

type RequiredEnvKey = typeof requiredEnvVars[number];

const env: Record<RequiredEnvKey, string> = requiredEnvVars.reduce((acc, key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  acc[key] = value;
  return acc;
}, {} as Record<RequiredEnvKey, string>);

export const config = {
  suitecrm: {
    baseUrl: env.SUITECRM_BASE_URL.replace(/\/$/, ""),
    clientId: env.SUITECRM_CLIENT_ID,
    clientSecret: env.SUITECRM_CLIENT_SECRET,
    grantType: env.SUITECRM_GRANT_TYPE || "client_credentials"
  },
  portal: {
    jwtSecret: env.PORTAL_JWT_SECRET,
    port: Number(env.PORT) || 4000
  }
};

export type AppConfig = typeof config;
