import type { JSX } from "preact/jsx-runtime";
import { AspectRatio } from "@/islands/aspect-ratio";

type Props = {
  src: string;
  alt: string;
  ratio?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  class?: string;
  className?: string;
  imgClass?: string;
  imgClassName?: string;
} & Omit<JSX.IntrinsicElements["div"], "children">;

export function AspectRatioImage({
  src,
  alt,
  ratio = 16 / 9,
  loading = "lazy",
  decoding = "async",
  class: classAttr,
  className,
  imgClass,
  imgClassName,
  style,
  ...props
}: Props) {
  const containerClass = classAttr ?? className;
  const imageClass = imgClass ?? imgClassName;

  return (
    <AspectRatio
      ratio={ratio}
      class={containerClass}
      style={{
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-2)",
        overflow: "hidden",
        ...(typeof style === "object" ? style : {})
      }}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        class={imageClass}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </AspectRatio>
  );
}
