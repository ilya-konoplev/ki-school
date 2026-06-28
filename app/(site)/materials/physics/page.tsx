import type { Metadata } from "next";
import { PhysicsTabs } from "@/components/materials/PhysicsTabs";
import { SubjectView } from "@/components/materials/SubjectView";
import { Container } from "@/components/ui/Container";
import { subjects } from "@/lib/content/materials";

export const metadata: Metadata = {
  title: "Физика – материалы",
  description: subjects.physics.description,
};

export default function PhysicsMaterialsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Физика
        </h1>
        <p className="mt-4 text-lg text-muted">{subjects.physics.description}</p>
      </div>

      <div className="mt-8">
        <PhysicsTabs active="topics" />
      </div>

      <div className="mt-10">
        <SubjectView subject={subjects.physics} />
      </div>
    </Container>
  );
}
