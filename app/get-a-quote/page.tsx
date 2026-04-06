import { Navbar } from "@/components/navbar";
import { QuoteForm } from "@/components/quote";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <QuoteForm />
      <Footer />
    </main>
  );
}
