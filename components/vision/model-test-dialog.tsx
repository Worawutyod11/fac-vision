"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Model, Detection, Camera } from "@/types/vision";
import Image from "next/image";

interface ModelTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: Model | null;
  cameras?: Camera[];
}

// Mock detection results
const generateMockDetections = (model: Model): Detection[] => {
  const numDetections = Math.floor(Math.random() * 4) + 1;
  return Array.from({ length: numDetections }, (_, i) => {
    const cls = model.classes[Math.floor(Math.random() * model.classes.length)];
    return {
      classId: cls.id,
      className: cls.name,
      confidence: Math.random() * 0.3 + 0.7,
      boundingBox: {
        x: Math.floor(Math.random() * 200) + 50,
        y: Math.floor(Math.random() * 150) + 50,
        width: Math.floor(Math.random() * 100) + 80,
        height: Math.floor(Math.random() * 80) + 60,
      },
      color: cls.color,
    };
  });
};

export function ModelTestDialog({
  open,
  onOpenChange,
  model,
  cameras = [],
}: ModelTestDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [processingTime, setProcessingTime] = useState(0);
  const [testImage, setTestImage] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [testSource, setTestSource] = useState<"upload" | "camera">("upload");

  const handleRunInference = async () => {
    if (!model) return;
    setIsProcessing(true);
    setDetections([]);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const mockDetections = generateMockDetections(model);
    const mockTime = Math.floor(Math.random() * 50) + 20;

    setDetections(mockDetections.filter((d) => d.confidence >= model.confidence));
    setProcessingTime(mockTime);
    setIsProcessing(false);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestImage(e.target?.result as string);
        setDetections([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (!selectedCamera) return;
    // Use camera's last frame or mock image
    setTestImage(selectedCamera.lastFrame || "/assets/pc_blueprint.gif");
    setDetections([]);
  };

  if (!model) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Test Model - {model.name}
          </DialogTitle>
          <DialogDescription>
            Upload an image and run inference to test the model
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Selection */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={testSource === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setTestSource("upload");
                setTestImage(null);
                setDetections([]);
              }}
              className="flex-1"
            >
              Upload Image
            </Button>
            <Button
              type="button"
              variant={testSource === "camera" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setTestSource("camera");
                setTestImage(null);
                setDetections([]);
              }}
              className="flex-1"
              disabled={cameras.length === 0}
            >
              Use Camera
            </Button>
          </div>

          {/* Camera Selection */}
          {testSource === "camera" && cameras.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Camera</label>
              <div className="flex flex-wrap gap-2">
                {cameras.map((camera) => (
                  <Button
                    key={camera.id}
                    variant={selectedCamera?.id === camera.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCamera(camera)}
                    disabled={camera.status !== "connected"}
                  >
                    {camera.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Image Preview Area */}
          <div className="relative aspect-video bg-muted/50 rounded-xl overflow-hidden border border-border">
            {testImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={testImage || "/placeholder.svg"}
                  alt="Test image"
                  fill
                  className="object-contain"
                />
                {/* Bounding Boxes Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {detections.map((detection, i) => (
                    <g key={i}>
                      <rect
                        x={`${(detection.boundingBox.x / 640) * 100}%`}
                        y={`${(detection.boundingBox.y / 480) * 100}%`}
                        width={`${(detection.boundingBox.width / 640) * 100}%`}
                        height={`${(detection.boundingBox.height / 480) * 100}%`}
                        fill="none"
                        stroke={detection.color}
                        strokeWidth="2"
                      />
                      <text
                        x={`${(detection.boundingBox.x / 640) * 100}%`}
                        y={`${((detection.boundingBox.y - 5) / 480) * 100}%`}
                        fill={detection.color}
                        fontSize="12"
                        fontFamily="monospace"
                      >
                        {detection.className} ({(detection.confidence * 100).toFixed(0)}%)
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p className="text-lg">No image selected</p>
                <p className="text-sm">Upload an image to test</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {testSource === "upload" ? (
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                />
                <Button variant="outline" className="w-full bg-transparent">
                  Upload Test Image
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCameraCapture}
                disabled={!selectedCamera || selectedCamera.status !== "connected"}
              >
                Capture from Camera
              </Button>
            )}
            <Button
              onClick={handleRunInference}
              disabled={!testImage || isProcessing}
            >
              {isProcessing ? "Processing..." : "Run Inference"}
            </Button>
          </div>

          {/* Results */}
          {detections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Detection Results</span>
                <span className="text-muted-foreground">
                  Processing time: {processingTime}ms
                </span>
              </div>
              <div className="space-y-2">
                {detections.map((detection, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      backgroundColor: `${detection.color}10`,
                      border: `1px solid ${detection.color}30`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: detection.color }}
                      />
                      <span className="font-medium">{detection.className}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Confidence: {(detection.confidence * 100).toFixed(1)}%</span>
                      <span className="mx-2">|</span>
                      <span>
                        Box: ({detection.boundingBox.x}, {detection.boundingBox.y},{" "}
                        {detection.boundingBox.width}, {detection.boundingBox.height})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detections.length === 0 && testImage && !isProcessing && processingTime > 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No detections above confidence threshold ({(model.confidence * 100).toFixed(0)}%)
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
