import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adminCookieName = "aibiz_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 12;

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function isAdminConfigured() {
  return Boolean(getAdminPassword() && getSessionSecret());
}

function secureEqual(actual: string, expected: string) {
  const actualHash = createHash("sha256").update(actual).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function createSessionValue(username: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + sessionMaxAgeSeconds * 1000
    })
  ).toString("base64url");

  return `${payload}.${signPayload(payload)}`;
}

function verifySessionValue(value: string | undefined) {
  if (!value || !isAdminConfigured()) {
    return false;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature || !secureEqual(signature, signPayload(payload))) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };

    return session.username === getAdminUsername() && typeof session.expiresAt === "number" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(username: string, password: string) {
  return isAdminConfigured() && secureEqual(username, getAdminUsername()) && secureEqual(password, getAdminPassword());
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(adminCookieName)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, createSessionValue(username), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
