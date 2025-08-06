import * as React from 'react';

export function BappendaJuaraLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 150 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Ant Body */}
      <path d="M25 35 a 5 5 0 0 1 -10 0 a 5 5 0 0 1 10 0" fill="black" />
      <path d="M30 30 a 7 7 0 0 1 -14 0 a 7 7 0 0 1 14 0" fill="black" />
      {/* Ant Head */}
      <circle cx="35" cy="25" r="8" fill="black" />
      {/* Eyes */}
      <circle cx="33" cy="23" r="2" fill="white" />
      <circle cx="38" cy="23" r="2" fill="white" />
      <circle cx="33.5" cy="23.5" r="1" fill="black" />
      <circle cx="38.5" cy="23.5" r="1" fill="black" />
      {/* Smile */}
      <path d="M33 28 q 2.5 2.5 5 0" stroke="white" strokeWidth="1" fill="none" />
      {/* Antennae */}
      <path d="M37 18 q -5 -5 -7 -10" stroke="black" strokeWidth="1" fill="none" />
      <path d="M33 18 q 5 -5 7 -10" stroke="black" strokeWidth="1" fill="none" />
      {/* Legs */}
      <path d="M28 37 l -5 5" stroke="black" strokeWidth="1" />
      <path d="M22 37 l 5 5" stroke="black" strokeWidth="1" />
      <path d="M30 33 l -5 5" stroke="#32CD32" strokeWidth="2" />
      <path d="M20 33 l 5 5" stroke="#32CD32" strokeWidth="2" />
      {/* Text */}
      <text
        x="50"
        y="25"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#000"
      >
        BAPPENDA
      </text>
      <text
        x="50"
        y="45"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="#32CD32"
        stroke="black"
        strokeWidth="0.5"
      >
        JUARA
      </text>
    </svg>
  );
}
