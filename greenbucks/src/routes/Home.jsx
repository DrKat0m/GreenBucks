import EcoHero from "../components/Hero/EcoHero";
import Dashboard from "./Dashboard";

export default function Home() {
  return (
    <>
      <EcoHero />
      <div className="mt-12 lg:mt-16" />
      <Dashboard />
    </>
  );
}
