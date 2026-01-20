"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Camera, CameraProtocol } from "@/types/vision";
import PlusIcon from "@/components/icons/plus";
import CameraIcon from "@/components/icons/camera";
import { CameraDialog } from "./camera-dialog";
import { CameraSettingsDialog } from "./camera-settings-dialog";

interface CameraListProps {
  cameras: Camera[];
}

export function CameraList({ cameras: initialCameras }: CameraListProps) {
  const [cameras, setCameras] = useState(initialCameras);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const handleCreateCamera = (data: Partial<Camera>) => {
    const newCamera: Camera = {
      id: `cam-${Date.now()}`,
      name: data.name || "New Camera",
      protocol: data.protocol || "GigE",
      connectionString: data.connectionString || "",
      status: "disconnected",
      mode: data.mode || "auto",
      triggerSource: data.triggerSource,
      triggerInterval: data.triggerInterval,
      settings: data.settings || {
        resolution: { width: 1920, height: 1080 },
        frameRate: 30,
        exposure: 10000,
        gain: 1.0,
        brightness: 50,
        contrast: 50,
        saturation: 50,
      },
      createdAt: new Date().toISOString(),
    };
    setCameras([newCamera, ...cameras]);
    setDialogOpen(false);
  };

  const handleEditCamera = (data: Partial<Camera>) => {
    if (!editingCamera) return;
    setCameras(
      cameras.map((c) =>
        c.id === editingCamera.id ? { ...c, ...data } : c
      )
    );
    setEditingCamera(null);
    setDialogOpen(false);
  };

  const handleUpdateSettings = (settings: Camera["settings"]) => {
    if (!selectedCamera) return;
    setCameras(
      cameras.map((c) =>
        c.id === selectedCamera.id ? { ...c, settings } : c
      )
    );
    setSelectedCamera(null);
    setSettingsDialogOpen(false);
  };

  const handleDeleteCamera = (cameraId: string) => {
    setCameras(cameras.filter((c) => c.id !== cameraId));
  };

  const handleTestConnection = (camera: Camera) => {
    // Simulate connection test
    setCameras(
      cameras.map((c) =>
        c.id === camera.id
          ? { ...c, status: Math.random() > 0.3 ? "connected" : "error" }
          : c
      )
    );
  };

  const getStatusColor = (status: Camera["status"]) => {
    switch (status) {
      case "connected":
        return "bg-success/20 text-success border-success/30";
      case "disconnected":
        return "bg-muted text-muted-foreground border-border";
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getProtocolColor = (protocol: CameraProtocol) => {
    switch (protocol) {
      case "GigE":
        return "bg-primary/20 text-primary border-primary/30";
      case "RTSP":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30";
      case "HTTP":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-display">Camera List</CardTitle>
            <Button
              onClick={() => {
                setEditingCamera(null);
                setDialogOpen(true);
              }}
            >
              <PlusIcon className="size-4 mr-2" />
              Add Camera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cameras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CameraIcon className="size-12 mb-4 opacity-50" />
              <p className="text-lg">No cameras configured</p>
              <p className="text-sm">Add a camera to start capturing images</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <CameraIcon className="size-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium">{camera.name}</h3>
                        <Badge variant="outline" className={getProtocolColor(camera.protocol)}>
                          {camera.protocol}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(camera.status)}>
                          {camera.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {camera.connectionString}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground/70">
                        <span>
                          {camera.settings.resolution.width}x{camera.settings.resolution.height}
                        </span>
                        <span>{camera.settings.frameRate} FPS</span>
                        <span>Mode: {camera.mode}</span>
                        {camera.mode === "snapshot" && camera.triggerSource && (
                          <span>Trigger: {camera.triggerSource}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(camera)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCamera(camera);
                        setSettingsDialogOpen(true);
                      }}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCamera(camera);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDeleteCamera(camera.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CameraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingCamera ? handleEditCamera : handleCreateCamera}
        defaultValues={editingCamera || undefined}
        mode={editingCamera ? "edit" : "create"}
      />

      <CameraSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
        camera={selectedCamera}
        onSave={handleUpdateSettings}
      />
    </>
  );
}
