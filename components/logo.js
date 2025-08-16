"use client";

"use client";

export default function Logo({ className = "" }) {
  return (
    <div className={`font-cyGrotesk text-3xl select-none ${className}`}>
      <span className="font-black text-[#0c0071]">Tribunal</span>
      <span className="font-light text-[#9347ff]">Hub</span>
    </div>
  );
}
