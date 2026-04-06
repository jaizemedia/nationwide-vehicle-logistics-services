import { Truck, Car, Package, ClipboardCheck, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: Car,
    title: "Trade Plate Movements",
    description:
      "Licensed trade plate drivers for efficient, legal vehicle movements between locations.",
  },
  {
    icon: Truck,
    title: "Single Vehicle Movements",
    description:
      "Professional driven delivery for individual vehicles with care and attention to detail.",
  },
  {
    icon: Package,
    title: "Bulk Delivery",
    description:
      "Coordinated multi-vehicle logistics for dealerships and fleet operators.",
  },
  {
    icon: ClipboardCheck,
    title: "Vehicle Inspection Services",
    description:
      "Thorough condition reports and quality checks before and after transport.",
  },
  {
    icon: Handshake,
    title: "Customer Handover",
    description:
      "Professional vehicle presentations and handovers to end customers on your behalf.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            Comprehensive Vehicle Logistics Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From collection to delivery, we handle every aspect of vehicle logistics with professionalism and care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-lg border border-border hover:border-foreground/20 transition-all duration-200"
            >
              <div className="p-3 bg-secondary rounded-lg w-fit mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}

          {/* CTA Card */}
          <div className="p-6 bg-primary text-primary-foreground rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Need a Custom Solution?</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Contact us to discuss your specific vehicle logistics requirements.
              </p>
            </div>
<Link href="/get-a-quote" passHref className="w-full">
  <Button
    variant="secondary"
    className="mt-6 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
  >
    Contact Us
    <ArrowRight className="h-4 w-4" />
  </Button>
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
