import type { ComponentChildren } from "preact";
import type { JSX } from "preact/jsx-runtime";

type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
  ratio?: number;
  children?: ComponentChildren;
};

export function AspectRatio({ ratio = 16 / 9, style, children, ...props }: Props) {
  return (
    <div
      {...props}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: String(ratio),
        ...(typeof style === "object" ? style : {})
      }}
    >
      {children}
    </div>
  );
}
