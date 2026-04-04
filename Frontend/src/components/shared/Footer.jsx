// Footer.jsx (compact)
import React from "react";

const IconButton = ({ label, children }) => (
  <a
    href="#"
    aria-label={label}
    className="grid h-8 w-8 place-items-center rounded-full border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition"
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#2b2b2b] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* Social + logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <IconButton label="Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M22 12a10 10 0 10-11.56 9.88v-7H8v-3h2.44V9.5A3.4 3.4 0 0114.07 6h2.36v3h-1.7c-.83 0-1.09.41-1.09 1.04V12H16.5l-.46 3h-2.4v7A10 10 0 0022 12z" />
              </svg>
            </IconButton>

            <IconButton label="Twitter">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.1-6.6L5.6 22H2l7.4-8.5L1 2h6.8l4.6 6L18.9 2zm-1.2 18h1.8L7 3.9H5.1L17.7 20z" />
              </svg>
            </IconButton>

            <IconButton label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 3.5A4.5 4.5 0 1112 16a4.5 4.5 0 010-9zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zM17.8 6.2a.9.9 0 11-.9-.9.9.9 0 01.9.9z" />
              </svg>
            </IconButton>

            <IconButton label="YouTube">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M21.6 7.2a3 3 0 00-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 002.4 7.2 31.6 31.6 0 002 12a31.6 31.6 0 00.4 4.8 3 3 0 002.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 002.1-2.1A31.6 31.6 0 0022 12a31.6 31.6 0 00-.4-4.8zM10.2 15.2V8.8L16 12l-5.8 3.2z" />
              </svg>
            </IconButton>

            <IconButton label="Pinterest">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12.1 2C6.6 2 3 5.6 3 10.7c0 3.6 2 5.6 4.1 5.6 1 0 1.6-2.8 1.6-3.6 0-.9-1-1.2-1-2.8 0-2.8 2.1-4.9 4.9-4.9 2.4 0 4.2 1.4 4.2 3.9 0 1.9-.8 5.4-3.2 5.4-.9 0-1.6-.7-1.4-1.6.2-1.1.8-2.3.8-3.5 0-.8-.4-1.5-1.3-1.5-1 0-1.8 1.1-1.8 2.5 0 .9.3 1.6.3 1.6l-1.2 5.3c-.3 1.3-.1 3-.1 3.2l.1.1c.2-.3 1-1.2 1.3-2.5l.7-2.6c.4.7 1.5 1.2 2.6 1.2 3.4 0 5.7-3.1 5.7-7.2C21 5.6 17.4 2 12.1 2z" />
              </svg>
            </IconButton>

            <IconButton label="LinkedIn">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M6.94 6.5A2.44 2.44 0 114.5 4.06 2.44 2.44 0 016.94 6.5zM5 8.5h3.9V21H5zM13.2 8.5H17v1.7h.1a4.2 4.2 0 013.8-2.1c4 0 4.7 2.6 4.7 6V21h-3.9v-5.3c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-3.9z" />
              </svg>
            </IconButton>
          </div>

          <div className="flex items-center gap-2 text-gray-200">
            <span className="grid h-6 w-6 place-items-center rounded bg-pink-600 text-[9px] font-bold text-white">
              BMS
            </span>
            <span className="text-sm font-semibold">bookMyScreen</span>
          </div>
        </div>

        <div className="mx-auto my-4 h-px w-full max-w-3xl bg-gray-700" />

        <div className="space-y-1 text-center text-[11px] leading-snug text-gray-400">
          <p>Copyright 2025 © bookMyScreen Pvt Ltd. All Rights Reserved.</p>
          <p className="mx-auto max-w-4xl">
            The content and images used on this site are copyright protected and
            copyrights vest with the respective owners. The usage is intended to
            promote the works and no endorsement is implied.
          </p>
        </div>
      </div>
    </footer>
  );
}