"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { Field, inputClass } from "./auth-shell";
import { OrDivider, SocialButtons } from "./social-buttons";
import { signIn } from "@/lib/auth-client";
import { validateEmail, validatePassword } from "@/lib/validation";

type Errors = { email?: string; password?: string; form?: string };

export function SignInForm({
  socialEnabled,
}: {
  socialEnabled: { google: boolean; github: boolean };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Where to land after a successful sign-in (set by the protected route). */
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const announced = useRef(false);

  // Landed here because a protected route bounced us? Say so, once.
  useEffect(() => {
    if (announced.current || next === "/") return;
    announced.current = true;
    toast("এই পেজটি দেখতে সাইন ইন করা প্রয়োজন।", { icon: "🔒", duration: 4500 });
  }, [next]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      toast.error("ফর্মে ভুল আছে — চিহ্নিত ঘরগুলো ঠিক করুন।");
      return;
    }

    setErrors({});
    setSubmitting(true);
    const loadingId = toast.loading("সাইন ইন করা হচ্ছে…");

    try {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        const message =
          error.status === 401 || error.status === 400
            ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
            : (error.message ?? "সাইন ইন করা যায়নি।");
        setErrors({ form: message });
        toast.error(message, { id: loadingId });
        return;
      }

      toast.success("সফলভাবে সাইন ইন করেছেন। স্বাগতম!", { id: loadingId });
      router.push(next);
      router.refresh();
    } catch {
      const message = "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrors({ form: message });
      toast.error(message, { id: loadingId });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field id="email" label="ইমেইল" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            disabled={submitting}
            className={inputClass}
          />
        </Field>

        <Field id="password" label="পাসওয়ার্ড" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            aria-invalid={Boolean(errors.password)}
            disabled={submitting}
            className={inputClass}
          />
        </Field>

        {errors.form ? (
          <p
            role="alert"
            className="rounded-lg border border-up/20 bg-up-soft px-3.5 py-2.5 text-sm font-medium text-up"
          >
            {errors.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "সাইন ইন করা হচ্ছে…" : "সাইন ইন"}
        </button>
      </form>

      <OrDivider />

      <SocialButtons enabled={socialEnabled} disabled={submitting} />

      <p className="mt-5 text-center text-sm text-muted">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href={next !== "/" ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="font-semibold text-brand-700 transition-colors hover:text-brand-600"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </>
  );
}
