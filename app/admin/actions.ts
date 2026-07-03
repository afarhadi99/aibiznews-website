"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminConfigured, verifyAdminCredentials } from "@/lib/adminAuth";

export async function loginAction(formData: FormData) {
  if (!isAdminConfigured()) {
    redirect("/admin/login?error=config");
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
