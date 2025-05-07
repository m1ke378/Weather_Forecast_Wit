interface HighlightedIconProps {
  src: string;
  alt: string;
  blur: number;
  height: number;
}

export default function HighlightedIcon({
  src,
  alt,
  blur,
  height,
}: HighlightedIconProps) {
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
