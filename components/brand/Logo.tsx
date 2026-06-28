/**
 * Логотип ki-school (маленькая версия для шапки/навигации):
 * декартовы оси x/y + кривая кубического корня в фирменном акценте.
 * Цвета берутся из дизайн-системы и меняются вместе с темой.
 */
export function Logo({
  size = 36,
  className = "",
  title = "ki-school",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <polyline
        points="4,20 36,20"
        stroke="var(--text-muted)"
        strokeWidth="1.2"
        fill="none"
      />
      <polyline
        points="20,4 20,36"
        stroke="var(--text-muted)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M6,30 C14,30 16,10 34,8"
        stroke="var(--accent)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
