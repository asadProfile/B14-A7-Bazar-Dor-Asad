"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { Field, inputClass } from "./auth-shell";
import { OrDivider, SocialButtons } from "./social-buttons";
import { signUp } from "@/lib/auth-client";
import {
  MIN_PASSWORD_LENGTH,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/validation";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
};

export function SignUpForm({
  socialEnabled,
}: {
  socialEnabled: { google: boolean; github: boolean };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    };
    if (nextErrors.name || nextErrors.email || nextErrors.password || nextErrors.confirm) {
      setErrors(nextErrors);
      toast.error("ফর্মে ভুল আছে — চিহ্নিত ঘরগুলো ঠিক করুন।");
      return;
    }

    setErrors({});
    setSubmitting(true);
    const loadingId = toast.loading("অ্যাকাউন্ট তৈরি করা হচ্ছে…");

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        const message =
          error.status === 422 || error.code === "USER_ALREADY_EXISTS"
            ? "এই ইমেইল দিয়ে আগেই একটি অ্যাকাউন্ট আছে। সাইন ইন করুন।"
            : (error.message ?? "অ্যাকাউন্ট তৈরি করা যায়নি।");
        setErrors({ form: message });
        toast.error(message, { id: loadingId });
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।", {
        id: loadingId,
        duration: 4000,
      });
      // The brief asks for registration to land the user on the sign-in page.
      router.push(
        next !== "/" ? `/signin?next=${encodeURIComponent(next)}` : "/signin",
      );
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
        <Field id="name" label="নাম" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="যেমন: রাফসান আহমেদ"
            aria-invalid={Boolean(errors.name)}
            disabled={submitting}
            className={inputClass}
          />
        </Field>

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

        <Field
          id="password"
          label="পাসওয়ার্ড"
          hint={`কমপক্ষে ${MIN_PASSWORD_LENGTH} অক্ষরের পাসওয়ার্ড দিন।`}
          error={errors.password}
        >
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            aria-invalid={Boolean(errors.password)}
            disabled={submitting}
            className={inputClass}
          />
        </Field>

        <Field
          id="confirm-password"
          label="পাসওয়ার্ড নিশ্চিত করুন"
          error={errors.confirm}
        >
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="আবার লিখুন"
            aria-invalid={Boolean(errors.confirm)}
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
          {submitting ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>

      <OrDivider />

      <SocialButtons enabled={socialEnabled} callbackURL={next} disabled={submitting} />

      <p className="mt-5 text-center text-sm text-muted">
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href={next !== "/" ? `/signin?next=${encodeURIComponent(next)}` : "/signin"}
          className="font-semibold text-brand-700 transition-colors hover:text-brand-600"
        >
          সাইন ইন করুন
        </Link>
      </p>
    </>
  );
}
