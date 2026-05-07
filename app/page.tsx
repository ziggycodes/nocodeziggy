import { Hero } from "@/components/sections/Hero";
import { SystemsLab } from "@/components/sections/SystemsLab";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { Content } from "@/components/sections/Content";
import { Services } from "@/components/sections/Services";
import { Experimental } from "@/components/sections/Experimental";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SystemsLab />
      <HowIBuild />
      <Content />
      <Services />
      <Experimental />
      <Contact />
    </>
  );
}
