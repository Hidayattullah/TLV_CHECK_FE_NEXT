// FILE INI SUDAH TIDAK DIGUNAKAN DAN DAPAT DIHAPUS.
// Komponen ini merupakan sisa dari templat awal dan tidak digunakan di mana pun.

import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="0"
        y="32"
        fontFamily="'Playfair Display', serif"
        fontSize="36"
        fontWeight="bold"
        fill="currentColor"
      >
        TLV
      </text>
       <text
        x="65"
        y="30"
        fontFamily="'Roboto', sans-serif"
        fontSize="24"
        fontWeight="normal"
        fill="currentColor"
        opacity="0.8"
      >
        Check
      </text>
    </svg>
  );
}
