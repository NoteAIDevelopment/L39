"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type AuthMode = "login" | "register" | "forgot";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (user: { name: string; email: string; role: string }) => void;
  initialMode?: AuthMode;
};

type AuthFormValues = z.infer<typeof loginSchema> | z.infer<typeof registerSchema> | z.infer<typeof forgotSchema>;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function AuthModal({ open, onClose, onAuthenticated, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });
  const forgotForm = useForm<z.infer<typeof forgotSchema>>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: AuthFormValues) => {
    setIsSubmitting(true);
    setServerMessage(null);

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : mode === "forgot" ? "/api/auth/forgot-password" : "/api/auth/login";
      const payload = mode === "register"
        ? {
            name: (data as z.infer<typeof registerSchema>).name,
            email: (data as z.infer<typeof registerSchema>).email,
            password: (data as z.infer<typeof registerSchema>).password,
          }
        : mode === "forgot"
          ? { email: (data as z.infer<typeof forgotSchema>).email }
          : {
              email: (data as z.infer<typeof loginSchema>).email,
              password: (data as z.infer<typeof loginSchema>).password,
            };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to complete request");
      }

      if (mode !== "forgot") {
        localStorage.setItem("aero-token", result.token);
        localStorage.setItem("aero-user", JSON.stringify(result.user));
        onAuthenticated(result.user);
      }

      setServerMessage(result.message || "Request completed successfully");
      if (mode !== "forgot") {
        onClose();
      }
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#D71920]">Member access</p>
                <h2 className="text-2xl font-semibold text-white">{mode === "login" ? "Welcome back" : mode === "register" ? "Create an account" : "Reset access"}</h2>
              </div>
              <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10" aria-label="Close auth panel">
                <X size={18} />
              </button>
            </div>

            {serverMessage ? <p className="mb-4 rounded-2xl border border-[#D71920]/30 bg-[#D71920]/10 p-3 text-sm text-[#FFD9DA]">{serverMessage}</p> : null}

            {mode === "login" ? (
              <form className="space-y-4" onSubmit={loginForm.handleSubmit(onSubmit as never)}>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="login-email">Email</label>
                  <input id="login-email" type="email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0" {...loginForm.register("email")} />
                  {loginForm.formState.errors.email ? <p className="mt-2 text-sm text-[#FFD9DA]">{loginForm.formState.errors.email.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="login-password">Password</label>
                  <input id="login-password" type="password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0" {...loginForm.register("password")} />
                  {loginForm.formState.errors.password ? <p className="mt-2 text-sm text-[#FFD9DA]">{loginForm.formState.errors.password.message}</p> : null}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#D71920] px-4 py-3 font-semibold text-white transition hover:bg-[#b7141a] disabled:opacity-70">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            ) : null}

            {mode === "register" ? (
              <form className="space-y-4" onSubmit={registerForm.handleSubmit(onSubmit as never)}>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="register-name">Full name</label>
                  <input id="register-name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0" {...registerForm.register("name")} />
                  {registerForm.formState.errors.name ? <p className="mt-2 text-sm text-[#FFD9DA]">{registerForm.formState.errors.name.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="register-email">Email</label>
                  <input id="register-email" type="email" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-0" {...registerForm.register("email")} />
                  {registerForm.formState.errors.email ? <p className="mt-2 text-sm text-[#FFD9DA]">{registerForm.formState.errors.email.message}</p> : null}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="register-password">Password</label>
                  <input id="register-password" type="password" className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-0" {...registerForm.register("password")} />
                  {registerForm.formState.errors.password ? <p className="mt-2 text-sm text-[#FFD9DA]">{registerForm.formState.errors.password.message}</p> : null}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#004A99] px-4 py-3 font-semibold text-white transition hover:bg-[#003b7a] disabled:opacity-70">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>
            ) : null}

            {mode === "forgot" ? (
              <form className="space-y-4" onSubmit={forgotForm.handleSubmit(onSubmit as never)}>
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="forgot-email">Email</label>
                  <input id="forgot-email" type="email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0" {...forgotForm.register("email")} />
                  {forgotForm.formState.errors.email ? <p className="mt-2 text-sm text-[#FFD9DA]">{forgotForm.formState.errors.email.message}</p> : null}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#004A99] px-4 py-3 font-semibold text-white transition hover:bg-[#003b7a] disabled:opacity-70">
                  {isSubmitting ? "Sending reset link..." : "Send reset instructions"}
                </button>
              </form>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="transition hover:text-white">
                {mode === "login" ? "Create an account" : "Return to login"}
              </button>
              <button onClick={() => setMode("forgot")} className="transition hover:text-white">
                Forgot password?
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
