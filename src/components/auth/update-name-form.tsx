"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Field, inputClass } from "./auth-shell";
import { updateUser } from "@/lib/auth-client";
import { validateName } from "@/lib/validation";

/**
 * Challenge requirement C3 — updates the signed-in user's name.
 *
 * Mirrors https://better-auth.com/docs/concepts/users-accounts#update-user
 */
export function UpdateNameForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const trimmed = name.trim();
    if (trimmed === initialName) {
      setError(undefined);
      toast("নাম আগের মতোই আছে — কোনো পরিবর্তন করা হয়নি।", { icon: "ℹ️" });
      return;
    }

    setError(undefined);
    setSubmitting(true);
    const loadingId = toast.loading("তথ্য আপডেট করা হচ্ছে…");

    try {
      const { error: updateError } = await updateUser({ name: trimmed });

      if (updateError) {
        const message = updateError.message ?? "তথ্য আপডেট করা যায়নি।";
        setError(message);
        toast.error(message, { id: loadingId });
        return;
      }

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে।", { id: loadingId });
      router.push("/profile");
      router.refresh();
    } catch {
      const message = "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message, { id: loadingId });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field
        id="update-name"
        label="নাম"
        hint="এই নামটিই নেভবারের প্রোফাইল মেনুতে দেখা যাবে।"
        error={error}
      >
        <input
          id="update-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="যেমন: রাফসান আহমেদ"
          aria-invalid={Boolean(error)}
          disabled={submitting}
          className={inputClass}
        />
      </Field>

      <div>
        <p className="text-sm text-muted">
          ইমেইল: <span className="font-medium text-ink">{email}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 px-5 py-3 text-[0.9375rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "আপডেট করা হচ্ছে…" : "আপডেট"}
      </button>
    </form>
  );
}
