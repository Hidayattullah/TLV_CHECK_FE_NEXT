import * as React from 'react';

export function GbiLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 150 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 10 C 10 0, 140 0, 140 10 L 140 90 C 140 140, 75 160, 10 90 Z"
        fill="#000000"
        stroke="#D4AF37"
        strokeWidth="5"
      />
      <path
        d="M15 15 C 15 5, 135 5, 135 15 L 135 88 C 135 135, 75 155, 15 88 Z"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
       <text
        x="75"
        y="40"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="18"
        fontWeight="bold"
        fill="#D4AF37"
      >
        GBI
      </text>
      <text
        x="75"
        y="65"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="16"
        fontWeight="bold"
        fill="#D4AF37"
      >
        THE LORD'S
      </text>
      <text
        x="75"
        y="85"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="16"
        fontWeight="bold"
        fill="#D4AF37"
      >
        VINEYARD
      </text>
      <text
        x="75"
        y="105"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="12"
        fill="#D4AF37"
      >
        PSALM 80
      </text>
      
      <path d="M75 145 L 75 110" stroke="#D4AF37" strokeWidth="3" />
      
      <path d="M75 110 C 60 110, 55 100, 50 95" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <path d="M75 110 C 90 110, 95 100, 100 95" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <path d="M75 120 C 60 120, 50 115, 40 105" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <path d="M75 120 C 90 120, 100 115, 110 105" stroke="#D4AF37" strokeWidth="2" fill="none" />
     
      <path d="M75 145 C 65 150, 55 150, 45 145" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M75 145 C 85 150, 95 150, 105 145" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M60 148 C 50 153, 40 153, 30 148" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <path d="M90 148 C 100 153, 110 153, 120 148" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
