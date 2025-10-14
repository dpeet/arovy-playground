import React from "react";

interface SparkleIconSVGProps {
  className?: string;
  size?: number;
  variant?: "color" | "black" | "white" | "disabled";
  disableInlineSize?: boolean; // When true, omit inline size styles (let CSS control sizing)
}

/**
 * Base SVG component for sparkle icon
 * This is the core visual element that can be wrapped by other components
 *
 * @param disableInlineSize - Skip inline width/height styles to allow CSS to control dimensions.
 *                            Use this when the SVG is inside a styled container like .circle or .badge
 */
const SparkleIconSVG = ({
  className,
  size = 24,
  variant = "color",
  disableInlineSize = false
}: SparkleIconSVGProps) => {
  // Generate unique IDs to avoid conflicts when multiple icons are on the same page
  const gradientId = React.useId();
  const strokeGradientId = React.useId();

  // Determine fill color based on variant
  const getFillColor = (): string => {
    switch (variant) {
      case "black":
        return "#000000";
      case "white":
        return "#FFFFFF";
      case "disabled":
        return "#949494";
      case "color":
        return `url(#${gradientId})`;
      default:
        return "#000000";
    }
  };

  const getStrokeColor = (): string => {
    if (variant === "color") {
      return `url(#${strokeGradientId})`;
    }
    return getFillColor();
  };

  const useGradient = variant === "color";

  return (
    <svg
      className={className}
      style={disableInlineSize ? undefined : { width: `${size}px`, height: `${size}px` }}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {useGradient && (
        <defs>
          <linearGradient id={gradientId} x1="60" y1="27" x2="101" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6EB8FF" />
            <stop offset="1" stopColor="#FF9E78" />
          </linearGradient>
          <linearGradient id={strokeGradientId} x1="61" y1="28" x2="100" y2="66.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#44A3FF" />
            <stop offset="1" stopColor="#FF8657" />
          </linearGradient>
        </defs>
      )}
      <g>
        <path
          d="M54.3799 41.3646C52.0485 51.856 43.8551 60.0495 33.3637 62.3809L22.1299 64.8773C18.7887 65.6197 18.7887 70.3824 22.1299 71.1249L33.3637 73.6213C43.8551 75.9527 52.0485 84.1458 54.3799 94.6378L56.8763 105.871C57.6188 109.212 62.3815 109.212 63.1239 105.871L65.6203 94.6378C67.9518 84.1458 76.1452 75.9527 86.6368 73.6213L97.8704 71.1249C101.211 70.3824 101.211 65.6197 97.8704 64.8773L86.6368 62.3809C76.1452 60.0495 67.9518 51.856 65.6203 41.3647L63.1239 30.1308C62.3815 26.7897 57.6188 26.7897 56.8763 30.1308L54.3799 41.3646Z"
          fill={getFillColor()}
        />
        <path
          d="M57.8525 30.3477C58.363 28.0508 61.6369 28.0508 62.1475 30.3477L64.6445 41.582C67.0603 52.4521 75.5494 60.9419 86.4199 63.3574L97.6533 65.8535C99.9501 66.364 99.9501 69.638 97.6533 70.1484L86.4199 72.6455C75.7192 75.0234 67.3256 83.2861 64.7617 93.9131L64.6445 94.4209L62.1475 105.654C61.637 107.951 58.363 107.951 57.8525 105.654L55.3564 94.4209C52.9408 83.55 44.4512 75.0613 33.5811 72.6455L22.3467 70.1484C20.0499 69.6379 20.0498 66.3641 22.3467 65.8535L33.5811 63.3574C44.4512 60.9418 52.9407 52.4521 55.3564 41.582L57.8525 30.3477Z"
          stroke={getStrokeColor()}
          strokeWidth="2"
          fill="none"
        />
      </g>
      <g>
        <path
          d="M89.8358 23.1212C88.9142 28.6036 84.619 32.8992 79.1365 33.8203L77.9762 34.0153C75.7514 34.3891 75.7514 37.5862 77.9762 37.96L79.1367 38.155C84.619 39.0761 88.9142 43.3714 89.8358 48.8537L90.0278 49.9984C90.4022 52.2236 93.5998 52.223 93.9726 49.9977L94.1646 48.8542C95.0846 43.3681 99.383 39.0694 104.869 38.1498L106.269 37.9152C108.486 37.5435 108.498 34.3613 106.284 33.9728L104.858 33.7227C99.4502 32.7741 95.2166 28.5398 94.2678 23.1322L94.015 21.6934C93.627 19.4795 90.4454 19.491 90.0734 21.7077L89.8358 23.1212Z"
          fill={getFillColor()}
        />
        <path
          d="M90.8135 21.832C91.0459 20.4468 93.0339 20.4397 93.2764 21.8232L93.5293 23.2617C94.5327 28.9804 99.0095 33.4587 104.729 34.4619L106.154 34.7119C107.538 34.9548 107.531 36.9435 106.145 37.1758L104.745 37.4102C98.9433 38.3828 94.3977 42.9289 93.4248 48.7305L93.2334 49.873V49.874C93.0077 51.2203 91.1251 51.2641 90.7949 50L90.7676 49.874L90.5752 48.7295L90.4736 48.1895C89.3156 42.6514 84.8772 38.3587 79.2607 37.415L78.1006 37.2207C76.7101 36.9871 76.7101 34.9885 78.1006 34.7549L79.2607 34.5596C85.0586 33.5854 89.6006 29.0427 90.5752 23.2451L90.8135 21.832Z"
          stroke={getStrokeColor()}
          strokeWidth="1.5"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default SparkleIconSVG;
