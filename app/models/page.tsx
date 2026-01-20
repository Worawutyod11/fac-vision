import DashboardPageLayout from "@/components/dashboard/layout";
import CubeIcon from "@/components/icons/cube";
import { ModelList } from "@/components/vision/model-list";
import { mockModels } from "@/data/vision-mock";

export default function ModelsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Models",
        description: "Upload and configure AI models",
        icon: CubeIcon,
      }}
    >
      <ModelList models={mockModels} />
    </DashboardPageLayout>
  );
}
