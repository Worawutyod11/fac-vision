"use client";

import React from "react"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Camera, CameraProtocol, CameraMode, TriggerSource } from "@/types/vision";

interface CameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Camera>) => void;
  defaultValues?: Partial<Camera>;
  mode: "create" | "edit";
}

const protocols: CameraProtocol[] = ["GigE", "RTSP", "HTTP", "USB"];
const cameraModes: CameraMode[] = ["auto", "snapshot"];
const triggerSources: TriggerSource[] = ["software", "hardware", "timer", "external"];

export function CameraDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode,
}: CameraDialogProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [protocol, setProtocol] = useState<CameraProtocol>(defaultValues?.protocol || "GigE");
  const [connectionString, setConnectionString] = useState(defaultValues?.connectionString || "");
  const [cameraMode, setCameraMode] = useState<CameraMode>(defaultValues?.mode || "auto");
  const [triggerSource, setTriggerSource] = useState<TriggerSource>(defaultValues?.triggerSource || "software");
  const [triggerInterval, setTriggerInterval] = useState(defaultValues?.triggerInterval || 5000);

  useEffect(() => {
    if (open) {
      setName(defaultValues?.name || "");
      setProtocol(defaultValues?.protocol || "GigE");
      setConnectionString(defaultValues?.connectionString || "");
      setCameraMode(defaultValues?.mode || "auto");
      setTriggerSource(defaultValues?.triggerSource || "software");
      setTriggerInterval(defaultValues?.triggerInterval || 5000);
    }
  }, [open, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !connectionString.trim()) return;
    onSubmit({
      name: name.trim(),
      protocol,
      connectionString: connectionString.trim(),
      mode: cameraMode,
      triggerSource: cameraMode === "snapshot" ? triggerSource : undefined,
      triggerInterval: cameraMode === "snapshot" && triggerSource === "timer" ? triggerInterval : undefined,
    });
  };

  const getPlaceholder = () => {
    switch (protocol) {
      case "GigE":
        return "192.168.1.100";
      case "RTSP":
        return "rtsp://192.168.1.100:554/stream";
      case "HTTP":
        return "http://192.168.1.100/snapshot";
      case "USB":
        return "/dev/video0";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {mode === "create" ? "Add New Camera" : "Edit Camera"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Configure a new camera connection"
              : "Update the camera configuration"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Camera Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter camera name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Protocol</label>
            <div className="flex gap-2">
              {protocols.map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={protocol === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProtocol(p)}
                  className="flex-1"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="connectionString" className="text-sm font-medium">
              Connection String
            </label>
            <Input
              id="connectionString"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder={getPlaceholder()}
              required
            />
            <p className="text-xs text-muted-foreground">
              {protocol === "GigE" && "Enter the IP address of the GigE camera"}
              {protocol === "RTSP" && "Enter the RTSP URL with port and stream path"}
              {protocol === "HTTP" && "Enter the HTTP URL for snapshot endpoint"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mode</label>
            <div className="flex gap-2">
              {cameraModes.map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={cameraMode === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCameraMode(m)}
                  className="flex-1 capitalize"
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>

          {cameraMode === "snapshot" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trigger Source</label>
                <div className="grid grid-cols-2 gap-2">
                  {triggerSources.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={triggerSource === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTriggerSource(t)}
                      className="capitalize"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {triggerSource === "timer" && (
                <div className="space-y-2">
                  <label htmlFor="triggerInterval" className="text-sm font-medium">
                    Trigger Interval (ms)
                  </label>
                  <Input
                    id="triggerInterval"
                    type="number"
                    value={triggerInterval}
                    onChange={(e) => setTriggerInterval(Number(e.target.value))}
                    min={100}
                    step={100}
                  />
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Add Camera" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
