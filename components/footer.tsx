import Link from "next/link";
import { Truck, Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const navigation = {
  services: [
    { name: "Trade Plate Movements", href: "#services" },
    { name: "Single Vehicle Movements", href: "#services" },
    { name: "Bulk Delivery", href: "#services" },
    { name: "Vehicle Inspections", href: "#services" },
    { name: "Customer Handover", href: "#services" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#get-a-quote" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },

  ],
};

export function Footer() {
  return (
    <footer id="contact" className="bg-muted text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-8 w-8" />
              <span className="font-semibold text-lg tracking-tight">CVLS</span>
            </div>
            <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-xs">
              Continental Vehicle Logistics Services - Your trusted partner for safe, reliable vehicle transport across the UK.
            </p>

            <div className="mt-6 space-y-3">
              <a 
                href="https://wa.me/233243863033" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+233 24 386 3033</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-muted-foreground/70">
                <Mail className="h-4 w-4" />
                <span>info@cvls.co.uk</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground/70">
                <MapPin className="h-4 w-4" />
                <span>Milton Keynes, United Kingdom and Tema, Ghana</span>
              </div>
            </div>
          </div>


          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-muted-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground/60">
              &copy; {new Date().getFullYear()} Continental Vehicle Logistics Services. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground/60">
              Fully Insured & Licensed Vehicle Transport
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
