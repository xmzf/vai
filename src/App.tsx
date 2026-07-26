import { useLenis } from "@/hooks/useLenis";
import { Navigation } from "@/components/Navigation";
import { NoiseBackground } from "@/components/NoiseBackground";
import { Hero } from "@/sections/Hero";
import { Works } from "@/sections/Works";
import { Contact } from "@/sections/Contact";

function Home() {
  useLenis();

  return (
    <>
      <NoiseBackground />
      <Navigation />
      <main>
        <Hero />
        <Works />
        <Contact />
      </main>
    </>
  );
}

export default function App() {
  return <Home />;
}
