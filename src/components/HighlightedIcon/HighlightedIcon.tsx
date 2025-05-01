export default function HighlightedIcon({
  src,
  alt,
  blur,
}: {
  src: string;
  alt: string;
  blur: number;
}) {
  return (
    <div
      style={{
        background: `url(${src})`,
        backgroundRepeat: "no-repeat !important",
        aspectRatio: 1 / 1,
        height: "200px",
      }}
    >
      <img src={src} alt={alt} style={{ backdropFilter: `blur(${blur}px)` }} />
    </div>
  );
}
