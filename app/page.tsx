import DashboardPageLayout from "@/components/dashboard/layout";
import FolderIcon from "@/components/icons/folder";
import { ProjectList } from "@/components/vision/project-list";
import { ProjectStats } from "@/components/vision/project-stats";
import { mockProjects, mockCameras, mockModels } from "@/data/vision-mock";

export default function ProjectsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Projects",
        description: "Manage your vision inspection projects",
        icon: FolderIcon,
      }}
    >
      <ProjectStats
        totalProjects={mockProjects.length}
        activeProjects={mockProjects.filter((p) => p.status === "active").length}
        totalCameras={mockCameras.length}
        totalModels={mockModels.length}
      />
      
      <ProjectList projects={mockProjects} />
    </DashboardPageLayout>
  );
}
