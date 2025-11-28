export default function DiceIcon({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <rect x="15" y="15" width="70" height="70" rx="12" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="35" cy="35" r="6" fill="#1e3a8a"/>
      <circle cx="50" cy="50" r="6" fill="#1e3a8a"/>
      <circle cx="65" cy="35" r="6" fill="#1e3a8a"/>
      <circle cx="35" cy="65" r="6" fill="#1e3a8a"/>
      <circle cx="65" cy="65" r="6" fill="#1e3a8a"/>
    </svg>
  );
}
