import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/types/vision";

interface ProjectState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
    }),
    {
      name: "vision-project-storage",
    },
  ),
);

interface LayoutState {
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isRightPanelOpen: false, // Default to closed as requested
      toggleRightPanel: () =>
        set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
      setRightPanelOpen: (open) => set({ isRightPanelOpen: open }),
    }),
    {
      name: "vision-layout-storage",
    },
  ),
);
