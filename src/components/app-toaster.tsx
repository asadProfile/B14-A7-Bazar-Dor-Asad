"use client";

import { Toaster } from "react-hot-toast";

/**
 * App-wide toast host. Every success / error message the app raises
 * (login, signup, logout, validation, protected-route redirects) renders here.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3200,
        style: {
          background: "#ffffff",
          color: "#16211a",
          border: "1px solid #e6ebe6",
          borderRadius: "0.75rem",
          padding: "10px 14px",
          fontSize: "0.9375rem",
          fontWeight: 500,
          boxShadow: "0 10px 30px -12px rgb(0 0 0 / 0.18)",
          maxWidth: "min(92vw, 26rem)",
        },
        success: {
          iconTheme: { primary: "#05893e", secondary: "#ffffff" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
        },
      }}
    />
  );
}
