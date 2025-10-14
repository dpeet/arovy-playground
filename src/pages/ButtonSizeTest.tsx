import { useEffect, useRef, useState } from "react";

import AIButton from "@/components/AIButton";
import AISparkleIcon from "@/components/AISparkleIcon";
import EasingTestButton from "@/components/EasingTestButton";
import { Button } from "antd";
import {
  easeOutQuad,
  easeOutCubic,
  easeOutQuart,
  easeOutExpo,
  easeOutCirc,
  easeOutBack,
} from "@/lib/easing";
import styles from "./ButtonSizeTest.module.scss";

interface ButtonMeasurement {
  variant: TestVariant;
  width: number;
  height: number;
}

const AI_VARIANTS = ["hero-outline", "hero"] as const;
type AiVariant = typeof AI_VARIANTS[number];
type TestVariant = AiVariant | "antd-default" | "antd-primary";
const TEST_VARIANTS = [...AI_VARIANTS, "antd-default", "antd-primary"] as const;
const MEASUREMENT_ORDER: TestVariant[] = ["antd-default", "hero-outline", "hero", "antd-primary"];

const isAiVariant = (variant: TestVariant): variant is AiVariant => variant !== "antd-default" && variant !== "antd-primary";

const ButtonSizeTest = () => {
  const [measurements, setMeasurements] = useState<ButtonMeasurement[]>([]);
  const wrappersRef = useRef<Map<TestVariant, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Delay measurement so AntD layout and gradient wrappers settle before sampling sizes
    const timer = window.setTimeout(() => {
      const newMeasurements: ButtonMeasurement[] = [];

      TEST_VARIANTS.forEach(variant => {
        const wrapper = wrappersRef.current.get(variant);
        if (wrapper) {
          // AI variants wrap the button in a gradient shell—measure that inner shell instead of the outer wrapper
          // Ant Design variants have no extra wrapper, so measure the button container directly
          let elementToMeasure = wrapper;
          if (isAiVariant(variant)) {
            const aiWrapper = wrapper.querySelector('div[class*="aiButtonWrapper"]');
            if (aiWrapper) {
              elementToMeasure = aiWrapper as HTMLDivElement;
            }
          }

          const rect = elementToMeasure.getBoundingClientRect();
          newMeasurements.push({
            variant,
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
          });
        }
      });

      newMeasurements.sort((a, b) => MEASUREMENT_ORDER.indexOf(a.variant) - MEASUREMENT_ORDER.indexOf(b.variant));
      setMeasurements(newMeasurements);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const reference = measurements[0];
  const tolerance = 0.25;
  const matchesHeight = (value: number) => reference ? Math.abs(value - reference.height) <= tolerance : true;
  const matchesWidth = (value: number) => reference ? Math.abs(value - reference.width) <= tolerance : true;
  const allSameHeight = measurements.every(m => matchesHeight(m.height));
  const allSameWidth = measurements.every(m => matchesWidth(m.width));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Button Size Consistency Test</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">All Variants (Same Content)</h2>
        <div className="flex gap-4 items-center flex-wrap">
          {TEST_VARIANTS.map(variant => (
            <div
              key={variant}
              ref={el => {
                if (el) wrappersRef.current.set(variant, el);
              }}
              className="relative"
            >
              {isAiVariant(variant) ? (
                <AIButton variant={variant}>
                  Summarize
                </AIButton>
              ) : variant === "antd-primary" ? (
                <Button
                  type="primary"
                  icon={<AISparkleIcon variant="white" size={20} />}
                >
                  Summarize
                </Button>
              ) : (
                <Button
                  type="default"
                  icon={<AISparkleIcon variant="custom" />}
                >
                  Summarize
                </Button>
              )}
              <div className="absolute -top-6 left-0 text-xs text-gray-600 font-medium">
                {variant}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Size Consistency Test</h2>
        {(['small', 'middle', 'large'] as const).map(size => (
          <div key={size} className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-600">Size: {size}</h3>
            <div className="flex gap-4 items-center">
              <AIButton variant="hero-outline" size={size}>
                Summarize
              </AIButton>
              <AIButton variant="hero" size={size}>
                Summarize
              </AIButton>
              <Button
                type="default"
                size={size}
                className={styles.antDefaultButton}
                icon={<AISparkleIcon variant="custom" size={size === 'small' ? 14 : size === 'large' ? 24 : 20} />}
              >
                Summarize
              </Button>
              <Button
                type="primary"
                size={size}
                icon={<AISparkleIcon variant="white" size={size === 'small' ? 14 : size === 'large' ? 24 : 20} />}
              >
                Summarize
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Easing Function Comparison</h2>
        <p className="text-sm text-gray-600 mb-4">
          Hover over each button to see how different easing functions affect the gradient rotation animation.
          All animations run for 300ms.
        </p>
        <div className="flex gap-6 items-start flex-wrap">
          <div className="flex flex-col items-center">
            <EasingTestButton
              easingFunction={easeOutQuad}
              easingLabel="easeOutQuad"
              useSymmetricEasing
            >
              Summarize
            </EasingTestButton>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Gentle, linear slowdown
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <EasingTestButton
                easingFunction={easeOutCubic}
                easingLabel="easeOutCubic"
                useSymmetricEasing
              >
                Summarize
              </EasingTestButton>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                ACTIVE
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Moderate, balanced
            </div>
          </div>

          <div className="flex flex-col items-center">
            <EasingTestButton
              easingFunction={easeOutQuart}
              easingLabel="easeOutQuart"
              useSymmetricEasing
            >
              Summarize
            </EasingTestButton>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Strong, snappy
            </div>
          </div>

          <div className="flex flex-col items-center">
            <EasingTestButton
              easingFunction={easeOutExpo}
              easingLabel="easeOutExpo"
              useSymmetricEasing
            >
              Summarize
            </EasingTestButton>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Very aggressive, dramatic
            </div>
          </div>

          <div className="flex flex-col items-center">
            <EasingTestButton
              easingFunction={easeOutCirc}
              easingLabel="easeOutCirc"
              useSymmetricEasing
            >
              Summarize
            </EasingTestButton>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Smooth, arc-like
            </div>
          </div>

          <div className="flex flex-col items-center">
            <EasingTestButton
              easingFunction={easeOutBack}
              easingLabel="easeOutBack"
              useSymmetricEasing
            >
              Summarize
            </EasingTestButton>
            <div className="text-xs text-gray-500 mt-1 max-w-[140px] text-center">
              Playful overshoot
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
          <h3 className="font-semibold mb-2">Current Implementation</h3>
          <p className="text-gray-700 mb-2">
            The AIButton component now uses <strong>bidirectional easing</strong> for more natural animations:
          </p>
          <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
            <li><code className="bg-blue-100 px-1 py-0.5 rounded">easeOutCubic</code> on hover-in (fast start → smooth landing)</li>
            <li><code className="bg-blue-100 px-1 py-0.5 rounded">easeInCubic</code> on hover-out (slow start → fast exit)</li>
          </ul>
          <p className="text-gray-700 mt-2">
            This creates symmetric, balanced motion that feels more natural than using the same easing in both directions.
            All test buttons above use the same bidirectional approach.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Measurements</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Variant</th>
              <th className="text-left py-2">Width (px)</th>
              <th className="text-left py-2">Height (px)</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map(m => {
              const isReference = m.variant === reference?.variant;
              const widthDiff = reference ? Math.round((m.width - reference.width) * 10) / 10 : 0;
              const heightDiff = reference ? Math.round((m.height - reference.height) * 10) / 10 : 0;
              const widthMatch = matchesWidth(m.width);
              const heightMatch = matchesHeight(m.height);
              return (
                <tr key={m.variant} className="border-b">
                  <td className="py-2 font-medium">{m.variant}</td>
                  <td className="py-2">{m.width}</td>
                  <td className="py-2">{m.height}</td>
                  <td className="py-2">
                    {isReference ? (
                      <span className="text-gray-500">Reference</span>
                    ) : widthMatch && heightMatch ? (
                      <span className="text-green-600 font-medium">✓ Match</span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        {!widthMatch && `Width diff: ${widthDiff}px`}
                        {!widthMatch && !heightMatch && " • "}
                        {!heightMatch && `Height diff: ${heightDiff}px`}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className={`flex items-center gap-2 ${allSameHeight ? 'text-green-600' : 'text-red-600'}`}>
              <span>{allSameHeight ? '✓' : '✗'}</span>
              <span>Height consistency: {allSameHeight ? 'All buttons match the Ant Design baseline height' : 'Some buttons fall outside the ±0.25px tolerance'}</span>
            </div>
            <div className={`flex items-center gap-2 ${allSameWidth ? 'text-green-600' : 'text-red-600'}`}>
              <span>{allSameWidth ? '✓' : '✗'}</span>
              <span>Width consistency: {allSameWidth ? 'All buttons match the Ant Design baseline width' : 'Widths differ from the Ant baseline beyond the tolerance'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
          <h3 className="font-semibold mb-2">Implementation Note</h3>
          <p className="text-gray-700">
            Each AI button wrapper uses padding equal to the gradient stroke width plus a matching negative margin. The inner button adds a transparent border and an inline height override so the stroke contributes to the final footprint while matching Ant Design dimensions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonSizeTest;
