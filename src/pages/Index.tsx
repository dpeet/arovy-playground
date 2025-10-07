import AIButton from "@/components/AIButton";
import { toast } from "sonner";

const BUTTONS = [
  {
    variant: "rotate",
    title: "Rotating Gradient",
    description: "Smooth gradient rotation on hover with enhanced saturation",
  },
  {
    variant: "shimmer",
    title: "Shimmer Effect",
    description: "Elegant shimmer sweep animation on hover",
  },
  {
    variant: "outline",
    title: "Gradient Outline",
    description: "Gradient border with color transition on hover",
  },
  {
    variant: "combined",
    title: "Combined Effect",
    description: "Rotating gradient background and border with glow",
  },
] as const;

const Index = () => {
  const handleClick = (title: (typeof BUTTONS)[number]["title"]) => {
    toast.success(`${title} button clicked!`, {
      description: "This showcases beautiful AI-powered button designs",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="flex justify-center">
            <h1
              className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-[image:var(--gradient-ai-hover)] inline-block"
              style={{ filter: "saturate(1.4) brightness(1.08)" }}
            >
              AI Button Showcase
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Explore four stunning button designs with gradient animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {BUTTONS.map(({ variant, title, description }) => (
            <div key={variant} className="flex flex-col items-center gap-4">
              <AIButton variant={variant} onClick={() => handleClick(title)}>
                Summarize
              </AIButton>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Click any button to see the interaction • Hover to see the animations
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
