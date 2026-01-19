export const ADMIN_EMAILS = [
  "tranvankhoa.ag.01@gmail.com",
  // Add more admin emails here
]

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
