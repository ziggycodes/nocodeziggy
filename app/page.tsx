import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { SystemsLab } from "@/components/sections/SystemsLab";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { Content } from "@/components/sections/Content";
import { Experimental } from "@/components/sections/Experimental";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <SystemsLab />
      <HowIBuild />
      <Content />
      <Experimental />
      <Contact />
    </>
  );
}
