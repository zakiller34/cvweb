// SVG icons for competencies - all icons use currentColor for theme compatibility

interface IconProps {
  className?: string;
}

export function CppIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21 0-3.9-.66-5.05-1.99C1.47 15.68.9 13.89.9 11.66c0-2.32.61-4.19 1.84-5.6C3.96 4.65 5.59 3.95 7.6 3.95c.76 0 1.42.07 1.98.2.56.13.98.28 1.26.43l-.53 2.49-1.01-.33c-.38-.11-.81-.17-1.29-.17-1.14 0-2.04.4-2.7 1.19-.66.8-.99 1.89-.99 3.28 0 1.35.31 2.41.94 3.17.63.77 1.49 1.15 2.58 1.15.48 0 .93-.04 1.35-.12.42-.08.79-.19 1.11-.33zm2.29-3.22h1.06v-1.06h1.1v1.06h1.06v1.1h-1.06v1.06h-1.1v-1.06h-1.06v-1.1zm4.77 0h1.06v-1.06h1.1v1.06h1.06v1.1h-1.06v1.06h-1.1v-1.06h-1.06v-1.1z"/>
    </svg>
  );
}

export function EdaIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="1"/>
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M9 2v4"/>
      <path d="M15 2v4"/>
      <path d="M9 18v4"/>
      <path d="M15 18v4"/>
      <path d="M2 9h4"/>
      <path d="M2 15h4"/>
      <path d="M18 9h4"/>
      <path d="M18 15h4"/>
    </svg>
  );
}

export function PythonIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.913 0zM8.708 1.85c.578 0 1.046.47 1.046 1.052 0 .581-.468 1.052-1.046 1.052-.579 0-1.046-.47-1.046-1.052 0-.582.467-1.052 1.046-1.052z"/>
      <path d="M12.087 24c6.093 0 5.713-2.656 5.713-2.656l-.007-2.752h-5.814v-.826h8.121s3.9.445 3.9-5.735c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.45s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24zm3.206-1.85c-.578 0-1.046-.47-1.046-1.052 0-.581.468-1.052 1.046-1.052.579 0 1.047.47 1.047 1.052 0 .582-.468 1.052-1.047 1.052z"/>
    </svg>
  );
}

export function FormalVerificationIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4"/>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
      <path d="M12 6v2"/>
      <path d="M12 16v2"/>
    </svg>
  );
}

export function HpcIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M6 7h.01"/>
      <path d="M10 7h.01"/>
      <path d="M14 7h.01"/>
      <path d="M18 7h.01"/>
      <path d="M6 11h.01"/>
      <path d="M10 11h.01"/>
      <path d="M14 11h.01"/>
      <path d="M18 11h.01"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
    </svg>
  );
}

export function TechScoutingIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
      <path d="M11 8v6"/>
      <path d="M8 11h6"/>
    </svg>
  );
}
