export default function HighlightedIcon({
  src,
  alt,
  blur,
  height,
}: {
  src: string;
  alt: string;
  blur: number;
  height: number;
}) {
  return (
    <div
      style={{
        background: `url(${src})`,
        backgroundRepeat: "no-repeat !important",
        aspectRatio: 1 / 1,
        height: `${height}px`,
      }}
    >
      <img src={src} alt={alt} style={{ backdropFilter: `blur(${blur}px)` }} />
    </div>
  );
}
