"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Trusted Continental Vehicle Transport
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight text-balance">
              Safe & Reliable Vehicle Logistics
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We provide comprehensive vehicle collection, inspection, delivery, and logistics services. Our professional drivers ensure safe, secure delivery right on schedule.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg"
              onClick={() => window.location.href = '/get-a-quote'}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Request a Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                <a href="#services">Our Services</a>
              </Button>
            </div>

          
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative lg:pl-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 p-6 bg-card rounded-lg border border-border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Shield className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fully Insured</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete coverage for every vehicle we transport
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
                <div className="p-3 bg-secondary rounded-lg w-fit mb-4">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Efficient routes and timely service
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
                <div className="p-3 bg-secondary rounded-lg w-fit mb-4">
                  <CheckCircle className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Quality Assured</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Professional inspection at every step
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
