import { Users, Target, Award } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
              A Local Company with Nationwide Reach
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We are a local vehicle movement and logistics support company, committed to safe, reliable, and efficient transport. Our team ensures every vehicle is handled with care and every client is informed.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Delivering stress-free logistics solutions for individuals and businesses alike, we combine local expertise with nationwide capabilities to meet all your vehicle transport needs.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-secondary rounded-lg mb-3">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Expert Team</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-secondary rounded-lg mb-3">
                  <Target className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Precision Focus</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-secondary rounded-lg mb-3">
                  <Award className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Quality Service</p>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-primary text-primary-foreground rounded-lg">
              <p className="text-3xl font-bold">Drivers</p>
              <p className="mt-2 text-primary-foreground/80">Approved by NVLS Driver Assessment</p>
            </div>
            <div className="p-8 bg-muted rounded-lg border border-border">
              <p className="text-2xl font-bold text-foreground">All drivers</p>
              <p className="mt-2 text-muted-foreground">Insured and Approved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
