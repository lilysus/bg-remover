"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isPro?: boolean;
}

export default function UserDropdown({ name, email, image, isPro }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {image ? (
          <img src={image} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-violet-500/30" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            {name?.[0] ?? "U"}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
            {isPro && (
              <span className="inline-block mt-1 text-xs font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>👤</span> Profile
            </Link>
            {!isPro && (
              <Link
                href="/profile#upgrade"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-violet-400 hover:bg-gray-800 transition-colors"
              >
                <span>🚀</span> Upgrade to Pro
              </Link>
            )}
          </div>

          <div className="border-t border-gray-800 py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>↩</span> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
