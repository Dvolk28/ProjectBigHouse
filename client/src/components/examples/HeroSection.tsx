import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <div style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
      <HeroSection
        onAddLightClick={() => console.log("Add Light clicked - scrolling to form")}
        litCount={12}
        totalCount={20}
      />
    </div>
  );
}
