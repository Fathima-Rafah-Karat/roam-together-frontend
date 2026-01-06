import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Plane, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse through amazing trips or create your own adventure",
    color: "from-primary to-primary-hover",
  },
  {
    icon: UserPlus,
    title: "Connect",
    description: "Meet like-minded travelers and join the community chat",
    color: "from-secondary to-secondary-hover",
  },
  {
    icon: Plane,
    title: "Travel",
    description: "Embark on unforgettable journeys with your new travel buddies",
    color: "from-accent to-accent-hover",
  },
  {
    icon: Heart,
    title: "Share",
    description: "Document your memories and inspire others with your stories",
    color: "from-primary to-accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to start your journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center hover:shadow-[var(--shadow-medium)] transition-all duration-300">
                <CardContent className="pt-12 pb-8 px-6">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-[var(--shadow-soft)]`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-primary shadow-[var(--shadow-soft)]">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
