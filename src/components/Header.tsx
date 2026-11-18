"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/30">
            H
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">
              Humanitzador IA
            </h1>
            <p className="text-white/40 text-xs">Text indetectable per IA</p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs bg-green-500/10 text-green-400 border border-green-400/20 px-3 py-1 rounded-full">
            🟢 Gemini + Groq actius
          </span>
        </div>

        {/* User */}
        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-3 py-2 transition-all duration-200"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Usuari"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 bg-purple-500/40 rounded-full flex items-center justify-center text-xs text-purple-300">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="text-white/80 text-sm hidden sm:block">
                {session.user.name?.split(" ")[0]}
              </span>
              <svg
                className="w-3 h-3 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-20 bg-slate-800 border border-white/10 rounded-xl shadow-xl p-1 min-w-[180px]">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-white text-sm font-medium truncate">
                      {session.user.name}
                    </p>
                    <p className="text-white/40 text-xs truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    🚪 Tancar sessió
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
