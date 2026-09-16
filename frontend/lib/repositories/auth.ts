import { auth } from "@/app/lib/auth/config"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function signOut() {
  const { signOut } = await import("@/app/lib/auth/config")
  await signOut({ redirectTo: "/auth/login" })
}