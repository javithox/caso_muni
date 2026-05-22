import dynamic from "next/dynamic";

const OpenStreetMapComponent = dynamic(
  () => import("@/app/components/OpenStreetMapComponent"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        OpenStreetMap
      </h1>

      <OpenStreetMapComponent />
    </main>
  );
}