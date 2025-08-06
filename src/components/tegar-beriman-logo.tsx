import * as React from 'react';

export function TegarBerimanLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M50 2.5L95 27.5V72.5L50 97.5L5 72.5V27.5L50 2.5Z"
        fill="#FDD11C"
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M50 12.5L85 32.5V67.5L50 87.5L15 67.5V32.5L50 12.5Z"
        fill="#00A651"
        stroke="#000"
        strokeWidth="2"
      />
      <circle cx="50" cy="50" r="20" fill="#fff" />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="10"
        fontWeight="bold"
        fill="#000"
      >
        TEGAR BERIMAN
      </text>
    </svg>
  );
}
