"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { signIn } from "@/lib/auth-client";

/** GitHub's mark — lucide dropped brand icons, so it is drawn inline. */
export function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

export function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.4 5.4 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

type Provider = "google" | "github";

/**
 * Google / GitHub sign-in buttons.
 *
 * When a provider has no credentials in the environment the button stays
 * visible but explains what is missing instead of silently failing — BetterAuth
 * would otherwise return an opaque configuration error.
 */
export function SocialButtons({
  enabled,
  callbackURL = "/",
  disabled = false,
}: {
  enabled: { google: boolean; github: boolean };
  callbackURL?: string;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState<Provider | null>(null);

  async function signInWith(provider: Provider) {
    if (!enabled[provider]) {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} লগইন এখনো চালু করা হয়নি — .env.local ফাইলে ${provider.toUpperCase()}_CLIENT_ID ও ${provider.toUpperCase()}_CLIENT_SECRET যোগ করুন।`,
        { duration: 6000 },
      );
      return;
    }

    setPending(provider);
    const loadingId = toast.loading("লগইন পেজে নিয়ে যাওয়া হচ্ছে…");
    try {
      const { error } = await signIn.social({ provider, callbackURL });
      if (error) {
        toast.error(error.message ?? "সোশ্যাল লগইন ব্যর্থ হয়েছে।", {
          id: loadingId,
        });
        setPending(null);
        return;
      }
      // On success the browser navigates away, so the toast is dismissed by
      // the unload — nothing more to do here.
    } catch {
      toast.error("সোশ্যাল লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", {
        id: loadingId,
      });
      setPending(null);
    }
  }

  // Both labels sit on one line at the card's width — see the Figma.
  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-2.5 py-2.5 text-[0.8125rem] font-medium whitespace-nowrap text-ink transition-colors hover:bg-[#f7faf7] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => signInWith("google")}
        disabled={disabled || pending !== null}
        className={buttonClass}
      >
        <GoogleIcon />
        {pending === "google" ? "অপেক্ষা করুন…" : "Google দিয়ে চালিয়ে যান"}
      </button>

      <button
        type="button"
        onClick={() => signInWith("github")}
        disabled={disabled || pending !== null}
        className={buttonClass}
      >
        <GithubIcon />
        {pending === "github" ? "অপেক্ষা করুন…" : "GitHub দিয়ে চালিয়ে যান"}
      </button>
    </div>
  );
}

/** The "অথবা" rule that separates the password form from the social buttons. */
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-muted">অথবা</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
