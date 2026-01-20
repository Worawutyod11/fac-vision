"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FolderIcon from "@/components/icons/folder";
import CameraIcon from "@/components/icons/camera";
import CubeIcon from "@/components/icons/cube";
import MonitorIcon from "@/components/icons/monitor";
import ZapIcon from "@/components/icons/zap";
import GearIcon from "@/components/icons/gear";
import BookIcon from "@/components/icons/book";

// Navigation items for Machine Vision System
const navItems = [
  {
    title: "Projects",
    url: "/",
    icon: FolderIcon,
  },
  {
    title: "Cameras",
    url: "/cameras",
    icon: CameraIcon,
  },
  {
    title: "Models",
    url: "/models",
    icon: CubeIcon,
  },
  {
    title: "Live View",
    url: "/live",
    icon: MonitorIcon,
  },
  {
    title: "Actions",
    url: "/actions",
    icon: ZapIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
  },
  {
    title: "Docs",
    url: "/docs",
    icon: BookIcon,
  },
];

export function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] py-4",
        className
      )}
    >
      <nav className="flex flex-col gap-1 h-full bg-sidebar rounded-2xl p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.url || 
            (item.url !== "/" && pathname.startsWith(item.url));
          
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="size-5 shrink-0" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
