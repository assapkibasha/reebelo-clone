import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "kg_admin_session";

function getAuthConfig() {
  return {
    username: process.env.ADMIN_USERNAME || "",
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

export function isAdminAuthConfigured() {
  const { username, password, secret } = getAuthConfig();
  return Boolean(username && password && secret);
}

function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function verifyAdminCredentials(username, password) {
  const config = getAuthConfig();
  if (!isAdminAuthConfigured()) return false;
  return timingSafeEqual(username, config.username) && timingSafeEqual(password, config.password);
}

export function createAdminToken(username) {
  const { secret } = getAuthConfig();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminToken(token) {
  const { secret } = getAuthConfig();
  if (!token || !secret || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");
  if (!signature || !timingSafeEqual(signature, sign(payload, secret))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Boolean(session.username && Number(session.expiresAt) > Date.now());
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
