import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import AISparkleIcon from "@/components/AISparkleIcon";
import AIButton from "@/components/AIButton";

interface ButtonMeasurement {
  variant: TestVariant;
  width: number;
  height: number;
}

const AI_VARIANTS = ["outline", "combined"] as const;
type AiVariant = typeof AI_VARIANTS[number];
type TestVariant = AiVariant | "antd-default" | "antd-primary";
const TEST_VARIANTS = [...AI_VARIANTS, "antd-default", "antd-primary"] as const;
const MEASUREMENT_ORDER: TestVariant[] = ["antd-default", "outline", "combined", "antd-primary"];

const isAiVariant = (variant: TestVariant): variant is AiVariant => variant !== "antd-default" && variant !== "antd-primary";

const ButtonSizeTest = () => {
  const [measurements, setMeasurements] = useState<ButtonMeasurement[]>([]);
  const wrappersRef = useRef<Map<TestVariant, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Measure all buttons after render
    const timer = window.setTimeout(() => {
      const newMeasurements: ButtonMeasurement[] = [];

      TEST_VARIANTS.forEach(variant => {
        const wrapper = wrappersRef.current.get(variant);
        if (wrapper) {
          const rect = wrapper.getBoundingClientRect();
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
                  icon={<AISparkleIcon variant="color" size={20} />}
                >
                  Summarize
                </Button>
              ) : (
                <Button
                  type="default"
                  icon={<AISparkleIcon variant="color" size={20} />}
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
              <AIButton variant="outline" size={size}>
                Summarize
              </AIButton>
              <AIButton variant="combined" size={size}>
                Summarize
              </AIButton>
              <Button
                type="default"
                size={size}
                icon={<AISparkleIcon variant="color" size={size === 'small' ? 14 : size === 'large' ? 24 : 20} />}
              >
                Summarize
              </Button>
              <Button
                type="primary"
                size={size}
                icon={<AISparkleIcon variant="color" size={size === 'small' ? 14 : size === 'large' ? 24 : 20} />}
              >
                Summarize
              </Button>
            </div>
          </div>
        ))}
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
