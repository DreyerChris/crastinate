"use client";
import clsx from "clsx";
import { useState } from "react";

const COLOR_CLASSES = [
  "bg-primary/20 border-primary",
  "bg-secondary/20 border-secondary",
  "bg-accent/20 border-accent",
  "bg-success/20 border-success",
  "bg-warning/20 border-warning",
  "bg-error/20 border-error",
];

export default function Background() {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full grid bg-[#050505] z-0"
      style={{
        gridTemplateColumns: "repeat(auto-fill, 32px)",
        gridTemplateRows: "repeat(auto-fill, 32px)",
      }}
    >
      {[...Array(300)].map((_, i) => (
        // biome-ignore lint:
        <Cell key={i} />
      ))}
    </div>
  );
}

function Cell() {
  const [tempActive, setTempActive] = useState(false);
  const colorClass =
    COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)];

  return (
    <div
      onMouseEnter={() => {
        setTempActive(true);
        setTimeout(() => setTempActive(false), 1000);
      }}
      className={clsx(
        "w-8 h-8 border",
        tempActive ? colorClass : "bg-base border-base-300 border-[1px]",
      )}
    />
  );
}
