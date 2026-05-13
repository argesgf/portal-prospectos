"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

function ShineBorder({
  borderRadius = 18,
  borderWidth = 0.5,
  duration = 14,
  color = "#000000ff",
  className,
  children,
}: ShineBorderProps) {
  const id = useId();

  const gradient =
    color instanceof Array ? color.join(",") : color;

  return (
    <div
      className={cn(
        "relative grid h-full w-full place-items-center",
        className,
      )}
      style={{ borderRadius }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          padding: borderWidth,
          borderRadius,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          backgroundImage: `radial-gradient(circle at center, transparent 30%, ${gradient}, transparent 70%)`,
          backgroundSize: "300% 300%",
          backgroundPosition: "0% 0%",
          animation: `shine-pulse-${id} ${duration}s infinite linear`,
        }}
      />
      <style>{`@keyframes shine-pulse-${id} {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
        100% { background-position: 0% 0%; }
      }`}</style>
      {children}
    </div>
  );
}

export { ShineBorder };
