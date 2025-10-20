import { useEffect, useRef, useState } from "react";

import AIButton from "@/components/AIButton";
import AISparkleIcon from "@/components/AISparkleIcon";
import EasingTestButton from "@/components/EasingTestButton";
import { TextReadabilityMockup } from "@/components/TextReadabilityMockup";
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
const MEASUREMENT_ORDER: TestVariant[] = ["antd-default", "hero-outline", "antd-primary", "hero"];

// Map AI variants to their Ant Design equivalents for comparison
const VARIANT_PAIRS: Record<AiVariant, "antd-default" | "antd-primary"> = {
  "hero-outline": "antd-default",
  "hero": "antd-primary",
};

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
        if (!wrapper) {
          console.error(`[Measurement] No wrapper found for ${variant}`);
          return;
        }

        // For AI variants: measure the aiButtonWrapper (outermost visual element with gradient border)
        // For Ant Design variants: measure the button element (outermost visual element)
        let elementToMeasure: HTMLElement | null = null;

        if (isAiVariant(variant)) {
          // Find the aiButtonWrapper - this represents the visual bounds
          const aiWrapper = wrapper.querySelector('div[class*="aiButtonWrapper"]');
          if (!aiWrapper) {
            console.error(`[Measurement] Failed to find aiButtonWrapper for ${variant}`);
            return; // Skip this variant instead of measuring wrong element
          }
          elementToMeasure = aiWrapper as HTMLDivElement;
        } else {
          // For Ant Design variants, find the button directly
          const button = wrapper.querySelector('button.ant-btn');
          if (!button) {
            console.error(`[Measurement] Failed to find button.ant-btn for ${variant}`);
            return; // Skip this variant instead of measuring wrong element
          }
          elementToMeasure = button as HTMLButtonElement;
        }

        // Use offsetWidth/Height for accurate layout measurements (excludes margins)
        newMeasurements.push({
          variant,
          width: elementToMeasure.offsetWidth,
          height: elementToMeasure.offsetHeight,
        });
      });

      newMeasurements.sort((a, b) => MEASUREMENT_ORDER.indexOf(a.variant) - MEASUREMENT_ORDER.indexOf(b.variant));
      setMeasurements(newMeasurements);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const tolerance = 2; // Allow 2px tolerance for visual footprint differences due to padding-based border technique

  // Helper to get the reference measurement for a given variant
  const getReference = (variant: TestVariant) => {
    if (isAiVariant(variant)) {
      const antdEquivalent = VARIANT_PAIRS[variant];
      return measurements.find(m => m.variant === antdEquivalent);
    }
    return undefined; // Ant Design variants don't need comparison
  };

  // Check if all AI variants match their Ant Design equivalents
  const aiVariantResults = AI_VARIANTS.map(aiVariant => {
    const aiMeasurement = measurements.find(m => m.variant === aiVariant);
    const reference = getReference(aiVariant);

    if (!aiMeasurement || !reference) return { variant: aiVariant, heightMatch: false, widthMatch: false };

    const heightMatch = Math.abs(aiMeasurement.height - reference.height) <= tolerance;
    const widthMatch = Math.abs(aiMeasurement.width - reference.width) <= tolerance;

    return { variant: aiVariant, heightMatch, widthMatch, aiMeasurement, reference };
  });

  const allHeightsMatch = aiVariantResults.every(r => r.heightMatch);
  const allWidthsMatch = aiVariantResults.every(r => r.widthMatch);

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
                  icon={<AISparkleIcon variant="custom" size={20} />}
                >
                  Summarize
                </Button>
              ) : (
                <Button
                  type="default"
                  icon={<AISparkleIcon variant="custom" size={20} />}
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
                icon={<AISparkleIcon variant="custom" size={size === 'small' ? 14 : size === 'large' ? 24 : 20} />}
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
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold z-10">
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
            The AIButton component uses <strong>easeOutCubic</strong> for smooth, balanced animations:
          </p>
          <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
            <li><code className="bg-blue-100 px-1 py-0.5 rounded">easeOutCubic</code> on hover-in (fast start → smooth landing)</li>
            <li><code className="bg-blue-100 px-1 py-0.5 rounded">easeOutCubic</code> on hover-out (consistent, predictable motion)</li>
          </ul>
          <p className="text-gray-700 mt-2">
            This creates a consistent feel with a moderate, balanced deceleration curve that works well for both
            entering and exiting states. The gradient angle rotates from 135° to 315° over 300ms.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Text Readability Solutions</h2>
        <p className="text-sm text-gray-600 mb-6">
          Compare different approaches to improve text readability on gradient backgrounds.
          Hover over each button to see the effect with animation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextReadabilityMockup
            variant="overlay"
            label="Option 1: Overlay"
            description="Semi-transparent dark overlay (rgba(0,0,0,0.2)) between gradient and text for better contrast"
          />
          <TextReadabilityMockup
            variant="text-shadow"
            label="Option 2: Text Shadow"
            description="Adds text-shadow (0 1px 3px rgba(0,0,0,0.4)) to create depth and improve legibility"
          />
          <TextReadabilityMockup
            variant="darker-gradient"
            label="Option 3: Darker Gradient"
            description="Uses darker gradient colors with white text for guaranteed high contrast"
          />
          <TextReadabilityMockup
            variant="bold-text"
            label="Option 5: Bold Text"
            description="Increases font-weight to 600 to make text more prominent and readable"
          />
          <TextReadabilityMockup
            variant="reduced-lightness"
            label="Option 8: Reduced Lightness"
            description="Keeps same hue range but reduces lightness values for better contrast"
          />
          <TextReadabilityMockup
            variant="lighter-gradient"
            label="Bonus: Lighter Gradient"
            description="Starts with lighter gradient colors - compare readability with original"
          />
        </div>
        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
          <h3 className="font-semibold mb-2">Recommendation</h3>
          <p className="text-gray-700">
            For the best readability and professional appearance, <strong>Option 3 (Darker Gradient + White Text)</strong> is recommended.
            It provides guaranteed high contrast that meets WCAG accessibility standards and works well across all devices.
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
              const isAntDesign = !isAiVariant(m.variant);
              const reference = getReference(m.variant);

              let statusContent;

              if (isAntDesign) {
                // Ant Design variants are the reference points
                statusContent = <span className="text-blue-600 font-medium">Reference (Ant Design)</span>;
              } else if (reference) {
                // AI variants are compared to their Ant Design equivalents
                const widthDiff = Math.round((m.width - reference.width) * 10) / 10;
                const heightDiff = Math.round((m.height - reference.height) * 10) / 10;
                const widthMatch = Math.abs(widthDiff) <= tolerance;
                const heightMatch = Math.abs(heightDiff) <= tolerance;

                if (widthMatch && heightMatch) {
                  statusContent = (
                    <span className="text-green-600 font-medium">
                      ✓ Matches {reference.variant}
                    </span>
                  );
                } else {
                  statusContent = (
                    <span className="text-red-600 font-medium">
                      vs {reference.variant}:
                      {!widthMatch && ` W${widthDiff >= 0 ? '+' : ''}${widthDiff}px`}
                      {!widthMatch && !heightMatch && " •"}
                      {!heightMatch && ` H${heightDiff >= 0 ? '+' : ''}${heightDiff}px`}
                    </span>
                  );
                }
              } else {
                statusContent = <span className="text-gray-500">No reference</span>;
              }

              return (
                <tr key={m.variant} className="border-b">
                  <td className="py-2 font-medium">{m.variant}</td>
                  <td className="py-2">{m.width}</td>
                  <td className="py-2">{m.height}</td>
                  <td className="py-2">{statusContent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center gap-2 ${allHeightsMatch ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-lg">{allHeightsMatch ? '✓' : '✗'}</span>
              <span>
                <strong>Height consistency:</strong> {allHeightsMatch
                  ? 'All AI variants match their Ant Design equivalents (visual footprint)'
                  : `Some AI variants differ from their Ant Design equivalents (±${tolerance}px tolerance)`}
              </span>
            </div>
            <div className={`flex items-center gap-2 ${allWidthsMatch ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-lg">{allWidthsMatch ? '✓' : '✗'}</span>
              <span>
                <strong>Width consistency:</strong> {allWidthsMatch
                  ? 'All AI variants match their Ant Design equivalents (visual footprint)'
                  : `Some AI variants differ from their Ant Design equivalents (±${tolerance}px tolerance)`}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 text-gray-700">
              <strong>Comparison pairs:</strong>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>hero-outline vs antd-default</li>
                <li>hero vs antd-primary</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
          <h3 className="font-semibold mb-2">Implementation Note</h3>
          <p className="text-gray-700">
            Each AI button uses the <strong>padding-based border technique</strong>: the wrapper has padding equal to
            the border width, and its gradient background shows through as the "border". A matching negative margin
            offsets the padding. The inner button has NO border property (any border creates dark line artifacts).
            This technique allows gradient borders with border-radius while maintaining Ant Design dimensions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonSizeTest;
