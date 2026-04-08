import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Footer />
      <PWAInstallPrompt />
    </main>
  );
}
