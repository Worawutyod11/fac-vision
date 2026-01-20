"use client";

import MonkeyIcon from "@/components/icons/monkey";
import BellIcon from "@/components/icons/bell";
import GearIcon from "@/components/icons/gear";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const user = {
  name: "KRIMSON",
  avatar: "/avatars/user_krimson.png",
};

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar rounded-b-2xl">
      <div className="flex h-[var(--header-height)] items-center justify-between px-6">
        {/* Left - Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary overflow-clip">
            <MonkeyIcon className="size-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display text-foreground">M.O.N.K.Y.</span>
            <span className="text-xs uppercase text-muted-foreground">The OS for Rebels</span>
          </div>
        </div>

        {/* Center - Navigation or Search (optional) */}
        <div className="flex-1" />

        {/* Right - Actions and User */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <BellIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <GearIcon className="size-5" />
          </Button>
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
            <span className="font-display text-lg text-foreground">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
