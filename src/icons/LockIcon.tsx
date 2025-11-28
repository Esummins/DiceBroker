export default function LockIcon({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <rect x="25" y="45" width="50" height="45" rx="8" fill="#93c5fd" stroke="#2563eb" strokeWidth="3"/>
      <path d="M 35 45 L 35 32 Q 35 22 50 22 Q 65 22 65 32 L 65 45" fill="none" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="50" cy="67" r="6" fill="#1e3a8a"/>
    </svg>
  );
}
