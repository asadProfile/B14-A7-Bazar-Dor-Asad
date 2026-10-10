/** Shared client-side form validation for the auth screens. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** BetterAuth is configured with the same minimum — keep the two in sync. */
export const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return "ইমেইল লিখুন।";
  if (!EMAIL_RE.test(value)) return "সঠিক ইমেইল ঠিকানা লিখুন, যেমন you@example.com";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "পাসওয়ার্ড লিখুন।";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `পাসওয়ার্ড কমপক্ষে ${MIN_PASSWORD_LENGTH} অক্ষরের হতে হবে।`;
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return "আপনার নাম লিখুন।";
  if (value.length < 2) return "নাম কমপক্ষে ২ অক্ষরের হতে হবে।";
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) return "পাসওয়ার্ডটি আবার লিখুন।";
  if (password !== confirm) return "দুইবার লেখা পাসওয়ার্ড মিলছে না।";
  return undefined;
}
