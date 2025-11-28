import LightForm from "../LightForm";

export default function LightFormExample() {
  return (
    <div className="py-8" style={{ background: "linear-gradient(to bottom, #070b14, #0a0f1a)" }}>
      <LightForm
        onSubmit={(data) => console.log("Form submitted:", data)}
        isSubmitting={false}
        availableBuildings={8}
      />
    </div>
  );
}
