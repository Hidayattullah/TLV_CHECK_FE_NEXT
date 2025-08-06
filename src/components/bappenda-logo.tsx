import * as React from 'react';

export function BappendaLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-4" {...props}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path d="M50 85C50 85 63 70 70 60C77 50 80 40 75 30C70 20 60 15 50 15C40 15 30 20 25 30C20 40 23 50 30 60C37 70 50 85 50 85Z" fill="#2A2A2A"/>
        <path d="M40 30C40 25 45 20 50 20C55 20 60 25 60 30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 25C30 20 25 20 20 25" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round"/>
        <path d="M65 25C70 20 75 20 80 25" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="42" cy="45" r="5" fill="white" />
        <circle cx="58" cy="45" r="5" fill="white" />
        <circle cx="42" cy="45" r="2" fill="#059669" />
        <circle cx="58" cy="45" r="2" fill="#059669" />
        <path d="M45 58C47.5 62 52.5 62 55 58C56 57 55 55 53 55L47 55C45 55 44 57 45 58Z" fill="red"/>
        <path d="M40 85L30 95" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 85L70 95" stroke="#2A2A2A" strokeWidth="5" strokeLinecap="round"/>
        <rect x="25" y="92" width="15" height="8" rx="4" fill="#10B981"/>
        <rect x="60" y="92" width="15" height="8" rx="4" fill="#10B981"/>
      </svg>
      <div
        className="text-4xl font-extrabold tracking-wider"
        style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
      >
        <span className="block">BAPPENDA</span>
        <span className="block text-5xl">JUARA</span>
      </div>
    </div>
  );
}
