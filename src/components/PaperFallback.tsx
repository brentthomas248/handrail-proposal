export default function PaperFallback() {
  return (
    <svg
      className="paper-fallback"
      viewBox="0 0 760 780"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="paper-front"
          x1="195"
          y1="210"
          x2="475"
          y2="570"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#d7dfe4" />
        </linearGradient>
        <linearGradient
          id="paper-fold"
          x1="295"
          y1="260"
          x2="505"
          y2="455"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f9fbfc" />
          <stop offset=".45" stopColor="#f0f3f5" />
          <stop offset="1" stopColor="#aab8c1" />
        </linearGradient>
        <linearGradient
          id="paper-navy"
          x1="440"
          y1="240"
          x2="620"
          y2="560"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#536c7d" />
          <stop offset="1" stopColor="#132b40" />
        </linearGradient>
        <filter id="paper-shadow" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <ellipse
        cx="398"
        cy="626"
        rx="197"
        ry="30"
        fill="#62717d"
        opacity=".2"
        filter="url(#paper-shadow)"
      />
      <g transform="rotate(-13 385 370)">
        <path
          d="m458 134 165 51-51 359-151-82 37-328Z"
          fill="url(#paper-navy)"
          stroke="#718391"
          strokeWidth=".6"
        />
        <path
          d="m280 263 178-129-37 328-154 146 13-345Z"
          fill="url(#paper-fold)"
          stroke="#dce2e6"
        />
        <path
          d="m125 165 155 98-13 345-143-113 1-330Z"
          fill="url(#paper-front)"
          stroke="#e6ebee"
        />
        <g stroke="#8999a6" strokeWidth="2" opacity=".6">
          <path d="m149 216 95 61m-95-44 95 61m-95-42 56 36" />
          <path d="m149 397 81 53m-81-36 81 53m-81-36 50 33" />
        </g>
        <g stroke="#a4b4c0" opacity=".7">
          <path d="m320 275 99-72m-99 88 99-72m-99 89 67-49" />
        </g>
        <g fill="#21364b">
          <path d="m149 310 5 3v25l-5-3v-25Zm12 8 5 3v25l-5-3v-25Zm12 8 5 3v25l-5-3v-25Z" />
          <path d="m320 367 80-59v6l-80 59v-6Z" />
        </g>
        <path
          d="m481 196 92 28m-94-14 91 28m-91-13 59 18m-63 151 88 40"
          stroke="#afc0cb"
          strokeWidth="2"
          opacity=".8"
        />
      </g>
    </svg>
  );
}
