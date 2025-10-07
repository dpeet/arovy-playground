import AIButton from '@/components/AIButton';
import { toast } from 'sonner';

const Index = () => {
  const handleClick = (variant: string) => {
    toast.success(`${variant} button clicked!`, {
      description: 'This showcases beautiful AI-powered button designs',
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="flex justify-center">
            <h1
              className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-[image:var(--gradient-ai-hover)] inline-block"
              style={{ filter: 'saturate(1.4) brightness(1.08)' }}
            >
              AI Button Showcase
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Explore four stunning button designs with gradient animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Button 1: Rotating Gradient */}
          <div className="flex flex-col items-center gap-4">
            <AIButton 
              variant="rotate" 
              onClick={() => handleClick('Rotating Gradient')}
            >
              Summarize
            </AIButton>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Rotating Gradient</h3>
              <p className="text-sm text-muted-foreground">
                Smooth gradient rotation on hover with enhanced saturation
              </p>
            </div>
          </div>

          {/* Button 2: Shimmer Effect */}
          <div className="flex flex-col items-center gap-4">
            <AIButton 
              variant="shimmer" 
              onClick={() => handleClick('Shimmer Effect')}
            >
              Summarize
            </AIButton>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Shimmer Effect</h3>
              <p className="text-sm text-muted-foreground">
                Elegant shimmer sweep animation on hover
              </p>
            </div>
          </div>

          {/* Button 3: Gradient Outline */}
          <div className="flex flex-col items-center gap-4">
            <AIButton 
              variant="outline" 
              onClick={() => handleClick('Gradient Outline')}
            >
              Summarize
            </AIButton>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Gradient Outline</h3>
              <p className="text-sm text-muted-foreground">
                Gradient border with color transition on hover
              </p>
            </div>
          </div>

          {/* Button 4: Combined Effect */}
          <div className="flex flex-col items-center gap-4">
            <AIButton 
              variant="combined" 
              onClick={() => handleClick('Combined Effect')}
            >
              Summarize
            </AIButton>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Combined Effect</h3>
              <p className="text-sm text-muted-foreground">
                Rotating gradient background and border with glow
              </p>
            </div>
          </div>
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
