import React from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const { googleSignIn } = useAuth();

  return (
    <div className="relative h-screen flex flex-col justify-center items-center bg-[#060608] text-white px-4 overflow-hidden select-none">

      {/* ── layered ambient blurs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-700/15 blur-[160px]" />
        <div className="absolute bottom-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full bg-fuchsia-500/8 blur-[100px] animate-pulse" />
      </div>

      {/* ── subtle grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── card ── */}
      <div className="relative z-10 w-full max-w-[420px] group">

        {/* outer glow ring on hover */}
        <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative bg-[#0c0c10]/80 backdrop-blur-3xl rounded-[2rem] border border-white/[0.06] shadow-2xl overflow-hidden">

          {/* inner top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="px-10 pt-14 pb-12">

            {/* ── logo ── */}
            <div className="flex justify-center mb-8 relative">
              <div className="absolute w-28 h-28 rounded-full bg-purple-500/15 blur-2xl" />
              <img
                src={logo}
                alt="KarmaLoop"
                className="relative z-10 w-20 h-20 object-contain drop-shadow-[0_0_24px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* ── heading ── */}
            <h1 className="text-center text-[2rem] font-extrabold leading-none tracking-tight mb-1">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                KarmaLoop
              </span>
            </h1>
            <p className="text-center text-[0.8rem] uppercase tracking-[0.25em] text-white/25 font-semibold mb-10">
              Focus Mastery Interface
            </p>

            {/* ── divider ── */}
            <div className="flex items-center gap-4 mb-10">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/20 font-bold">sign&nbsp;in</span>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {/* ── CTA button ── */}
            <button
              onClick={googleSignIn}
              className="
                relative w-full flex items-center justify-center gap-3
                bg-white text-[#111] font-bold text-[0.95rem]
                py-[14px] px-6 rounded-xl
                transition-all duration-300 ease-out
                hover:-translate-y-0.5
                hover:shadow-[0_14px_36px_-6px_rgba(255,255,255,0.18)]
                active:scale-[0.98]
                cursor-pointer
              "
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            {/* ── subtle legal line ── */}
            <p className="mt-6 text-center text-[0.65rem] text-white/15 leading-relaxed">
              By continuing you agree to our Terms&nbsp;of&nbsp;Service
            </p>
          </div>
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="absolute bottom-6 flex items-center gap-2 text-white/15 text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
        <span className="inline-block w-1 h-1 rounded-full bg-emerald-400/60" />
        All systems operational
      </div>
    </div>
  );
};

export default Login;