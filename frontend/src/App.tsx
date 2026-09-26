import { WalletProvider } from "./context/WalletContext";
import { useMetropolis } from "./hooks/useMetropolis";
import { Background } from "./components/Background";
import { ScrollProgress } from "./components/ScrollProgress";
import { PageDots } from "./components/PageDots";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { Manifesto } from "./components/Manifesto";
import { CultureIndex } from "./components/CultureIndex";
import { Ticker } from "./components/Ticker";
import { CulturePulse } from "./components/CulturePulse";
import { LiveSignals } from "./components/LiveSignals";
import { Leaderboard } from "./components/Leaderboard";
import { Mechanics } from "./components/Mechanics";
import { ActivityFeed } from "./components/ActivityFeed";
import { Portfolio } from "./components/Portfolio";
import { Footer } from "./components/Footer";

function Shell() {
  const { signals } = useMetropolis();

  return (
    <div className="scanlines min-h-screen">
      <Background />
      <ScrollProgress />
      <PageDots />
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <Manifesto />
        <CultureIndex />
        <Ticker />
        <CulturePulse />
        <LiveSignals />
        <Leaderboard signals={signals} />
        <Mechanics />
        <ActivityFeed />
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <Shell />
    </WalletProvider>
  );
}
