import { useEffect, useRef, useState } from "react";
import AIButton from "@/components/AIButton";
import { Button } from "antd";
import AISparkleIcon from "@/components/AISparkleIcon";

interface ButtonMeasurement {
  variant: string;
  width: number;
  height: number;
}

const ButtonSizeTest = () => {
  const [measurements, setMeasurements] = useState<ButtonMeasurement[]>([]);
  const buttonsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const variants = ["rotate", "shimmer", "outline", "antd-default", "combined"] as const;

  useEffect(() => {
    // Measure all buttons after render
    const timer = setTimeout(() => {
      const newMeasurements: ButtonMeasurement[] = [];

      variants.forEach(variant => {
        const element = buttonsRef.current.get(variant);
        if (element) {
          const button = element.querySelector('button') || element.firstElementChild;
          if (button) {
            const rect = button.getBoundingClientRect();
            newMeasurements.push({
              variant,
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10,
            });
          }
        }
      });

      setMeasurements(newMeasurements);
    }, 100);

    return () => clearTimeout(timer);
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
          {variants.map(variant => (
            <div
              key={variant}
              ref={el => {
                if (el) buttonsRef.current.set(variant, el);
              }}
              className="relative"
            >
              {variant === "antd-default" ? (
                <Button
                  type="default"
                  icon={<AISparkleIcon variant="color" size={20} />}
                >
                  Summarize
                </Button>
              ) : (
                <AIButton variant={variant as any}>
                  Summarize
                </AIButton>
              )}
              <div className="absolute -top-6 left-0 text-xs text-gray-600 font-medium">
                {variant}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Gradient Intensity Variations (Outline)</h2>
        <div className="flex gap-4 items-center flex-wrap">
          {[0, 0.3, 0.5, 0.7, 1].map(intensity => (
            <div key={intensity} className="flex flex-col items-center gap-2">
              <AIButton variant="outline" gradientIntensity={intensity}>
                Summarize
              </AIButton>
              <span className="text-xs text-gray-600">
                {intensity === 0 ? "0 (Gray)" : intensity === 0.3 ? "0.3 (Default)" : intensity === 1 ? "1 (Full)" : intensity}
              </span>
            </div>
          ))}
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
            The outline and combined variants use wrapper divs with <code className="bg-white px-1 py-0.5 rounded">padding: 2px</code>
            and <code className="bg-white px-1 py-0.5 rounded">margin: -2px</code> to maintain consistent dimensions
            while creating gradient border effects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonSizeTest;