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

      setMeasurements(newMeasurements);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  const allSameHeight = measurements.length > 0 &&
    measurements.every(m => m.height === measurements[0].height);
  const allSameWidth = measurements.length > 0 &&
    measurements.every(m => m.width === measurements[0].width);

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
            {measurements.map((m, i) => (
              <tr key={m.variant} className="border-b">
                <td className="py-2 font-medium">{m.variant}</td>
                <td className="py-2">{m.width}</td>
                <td className="py-2">{m.height}</td>
                <td className="py-2">
                  {i === 0 ? (
                    <span className="text-gray-500">Reference</span>
                  ) : (
                    <>
                      {m.width === measurements[0].width && m.height === measurements[0].height ? (
                        <span className="text-green-600 font-medium">✓ Match</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          ✗ {m.width !== measurements[0].width && `Width diff: ${m.width - measurements[0].width}px`}
                          {m.height !== measurements[0].height && ` Height diff: ${m.height - measurements[0].height}px`}
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className={`flex items-center gap-2 ${allSameHeight ? 'text-green-600' : 'text-red-600'}`}>
              <span>{allSameHeight ? '✓' : '✗'}</span>
              <span>Height consistency: {allSameHeight ? 'All buttons have the same height' : 'Heights are inconsistent'}</span>
            </div>
            <div className={`flex items-center gap-2 ${allSameWidth ? 'text-green-600' : 'text-red-600'}`}>
              <span>{allSameWidth ? '✓' : '✗'}</span>
              <span>Width consistency: {allSameWidth ? 'All buttons have the same width' : 'Widths are inconsistent'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-sm">
          <h3 className="font-semibold mb-2">Implementation Note</h3>
          <p className="text-gray-700">
            Outline buttons use a 1px wrapper padding while combined buttons use 2px. Each applies a matching negative margin to keep the overall footprint consistent while rendering the gradient borders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonSizeTest;
