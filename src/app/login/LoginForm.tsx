"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-2">รหัสผ่าน</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "กำลังตรวจ..." : "เข้าดูแผน"}
      </button>
    </form>
  );
}
