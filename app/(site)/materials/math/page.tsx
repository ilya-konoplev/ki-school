import type { Metadata } from "next";
import { SubjectView } from "@/components/materials/SubjectView";
import { Container } from "@/components/ui/Container";
import { subjects } from "@/lib/content/materials";

export const metadata: Metadata = {
  title: "Математика — материалы",
  description: subjects.math.description,
};

export default function MathMaterialsPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Математика
        </h1>
        <p className="mt-4 text-lg text-muted">{subjects.math.description}</p>
      </div>

      <div className="mt-10">
        <SubjectView subject={subjects.math} />
      </div>
    </Container>
  );
}
