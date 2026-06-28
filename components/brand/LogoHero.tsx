/**
 * Крупный анимированный логотип для hero-блока главной страницы.
 * Кривая кубического корня «прорисовывается» при загрузке (см. .hero-logo в globals.css).
 * Цвета осей и кривой – из дизайн-системы (меняются вместе с темой).
 */
export function LogoHero({
  size = 200,
  className = "",
  title = "ki-school",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={`hero-logo ${className}`}
    >
      <line className="axis" x1="10" y1="170" x2="190" y2="170" />
      <line className="axis" x1="40" y1="190" x2="40" y2="10" />
      <path className="curve" d="M 20,180 C 60,165 70,40 180,20" />
    </svg>
  );
}
