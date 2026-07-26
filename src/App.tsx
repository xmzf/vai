import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLenis } from "@/hooks/useLenis";
import { Navigation } from "@/components/Navigation";
import { NoiseBackground } from "@/components/NoiseBackground";
import { Hero } from "@/sections/Hero";
import { Manifesto } from "@/sections/Manifesto";
import { Works } from "@/sections/Works";
import { Services } from "@/sections/Services";
import { Contact } from "@/sections/Contact";

function Home() {
  useLenis();

  return (
    <>
      <NoiseBackground />
      <Navigation />
      <main>
        <Hero />
        <Manifesto />
        <Works />
        <Services />
        <Contact />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
