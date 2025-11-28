export default function TargetIcon({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" strokeWidth="5"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff" strokeWidth="5"/>
      <circle cx="50" cy="50" r="19" fill="none" stroke="#dc2626" strokeWidth="5"/>
      <circle cx="50" cy="50" r="8" fill="#ffffff"/>
    </svg>
  );
}
