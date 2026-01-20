import DashboardPageLayout from "@/components/dashboard/layout";
import MonitorIcon from "@/components/icons/monitor";
import { LiveMonitor } from "@/components/vision/live-monitor";
import { mockCameras, mockModels, mockInferenceResults } from "@/data/vision-mock";

export default function LivePage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Live View",
        description: "Real-time monitoring and detection results",
        icon: MonitorIcon,
      }}
    >
      <LiveMonitor
        cameras={mockCameras}
        models={mockModels}
        initialResults={mockInferenceResults}
      />
    </DashboardPageLayout>
  );
}
