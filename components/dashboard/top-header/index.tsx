"use client";

import BellIcon from "@/components/icons/bell";
import GearIcon from "@/components/icons/gear";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, PanelRightOpen, PanelRightClose } from "lucide-react";
import { useTheme } from "next-themes";
import { useLayoutStore } from "@/lib/store";

const user = {
  name: "Admin",
  avatar: "/avatars/user_krimson.png",
};

export function TopHeader() {
  const { setTheme, theme } = useTheme();
  const { isRightPanelOpen, toggleRightPanel } = useLayoutStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar rounded-b-2xl">
      <div className="flex h-[var(--header-height)] items-center justify-between px-6">
        {/* Left - Logo Image */}
        <div className="flex items-center gap-4">
          <Image
            src="/assets/logos/logo-fac-vision-dark.png"
            alt="Fac Vision"
            width={160}
            height={51}
            className="h-15 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src="/assets/logos/logo-fac-vision-light.png"
            alt="Fac Vision"
            width={160}
            height={51}
            className="hidden h-15 w-auto object-contain dark:block"
            priority
          />
        </div>

        {/* Center */}
        <div className="flex-1" />

        {/* Right - Actions and User */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleRightPanel}
            title={isRightPanelOpen ? "Close Panel" : "Open Panel"}
          >
            {isRightPanelOpen ? (
              <PanelRightClose className="size-5" />
            ) : (
              <PanelRightOpen className="size-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <BellIcon className="size-5" />
          </Button>
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <GearIcon className="size-5" />
            </Button>
          </Link>
          <div className="ml-2 flex items-center gap-3">
            <div className="size-9 rounded-full overflow-clip bg-primary">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                width={36}
                height={36}
                className="size-full object-cover"
              />
            </div>
            <span className="font-display text-lg text-foreground">
              {user.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
