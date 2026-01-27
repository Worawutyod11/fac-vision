"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Camera, Model, InferenceResult, Detection } from "@/types/vision";
import Image from "next/image";

interface LiveMonitorProps {
  cameras: Camera[];
  models: Model[];
  initialResults: InferenceResult[];
}

export function LiveMonitor({
  cameras,
  models,
  initialResults,
}: LiveMonitorProps) {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(
    cameras.find((c) => c.status === "connected") || cameras[0] || null
  );
  const [selectedModels, setSelectedModels] = useState<Model[]>(
    models.filter((m) => m.status === "ready").slice(0, 1)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<InferenceResult[]>(initialResults);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({
    totalInspections: 0,
    passCount: 0,
    failCount: 0,
    avgProcessingTime: 0,
  });

  // Generate mock detections
  const generateMockDetection = useCallback((): InferenceResult | null => {
    if (!selectedCamera || selectedModels.length === 0) return null;

    // Randomly pick one of the selected models for this detection
    const selectedModel = selectedModels[Math.floor(Math.random() * selectedModels.length)];

    const numDetections = Math.floor(Math.random() * 3) + 1;
    const detections: Detection[] = Array.from({ length: numDetections }, () => {
      const cls =
        selectedModel.classes[
          Math.floor(Math.random() * selectedModel.classes.length)
        ];
      return {
        classId: cls.id,
        className: cls.name,
        confidence: Math.random() * 0.3 + 0.7,
        boundingBox: {
          x: Math.floor(Math.random() * 300) + 50,
          y: Math.floor(Math.random() * 200) + 50,
          width: Math.floor(Math.random() * 120) + 80,
          height: Math.floor(Math.random() * 100) + 60,
        },
        color: cls.color,
      };
    });

    return {
      id: `result-${Date.now()}`,
      timestamp: new Date().toISOString(),
      cameraId: selectedCamera.id,
      modelId: selectedModel.id,
      imageUrl: "/assets/pc_blueprint.gif",
      detections: detections.filter((d) => d.confidence >= selectedModel.confidence),
      processingTime: Math.floor(Math.random() * 50) + 20,
    };
  }, [selectedCamera, selectedModels]);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newResult = generateMockDetection();
      if (newResult) {
        setCurrentDetections(newResult.detections);
        setResults((prev) => [newResult, ...prev].slice(0, 50));

        // Update stats
        setStats((prev) => {
          const hasDefect = newResult.detections.some((d) => d.classId !== 0);
          const totalInspections = prev.totalInspections + 1;
          const passCount = hasDefect ? prev.passCount : prev.passCount + 1;
          const failCount = hasDefect ? prev.failCount + 1 : prev.failCount;
          const avgProcessingTime =
            (prev.avgProcessingTime * prev.totalInspections +
              newResult.processingTime) /
            totalInspections;

          return { totalInspections, passCount, failCount, avgProcessingTime };
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, generateMockDetection]);

  const toggleModel = (model: Model) => {
    setSelectedModels((prev) => {
      const isSelected = prev.some((m) => m.id === model.id);
      if (isSelected) {
        // Remove model
        return prev.filter((m) => m.id !== model.id);
      } else {
        // Add model
        return [...prev, model];
      }
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Camera Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground block mb-1">
                Camera
              </label>
              <div className="flex flex-wrap gap-2">
                {cameras.map((camera) => (
                  <Button
                    key={camera.id}
                    variant={
                      selectedCamera?.id === camera.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCamera(camera)}
                    disabled={camera.status !== "connected"}
                  >
                    {camera.name}
                    {camera.status !== "connected" && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        offline
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground block mb-1">
                Model
              </label>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <Button
                    key={model.id}
                    variant={
                      selectedModels.some((m) => m.id === model.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleModel(model)}
                    disabled={model.status !== "ready"}
                  >
                    {model.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Start/Stop */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Control
              </label>
              <Button
                variant={isRunning ? "destructive" : "default"}
                onClick={() => setIsRunning(!isRunning)}
                disabled={!selectedCamera || selectedModels.length === 0}
                className="min-w-[100px]"
              >
                {isRunning ? "Stop" : "Start"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Inspections</p>
            <p className="text-2xl font-display">{stats.totalInspections}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pass</p>
            <p className="text-2xl font-display text-success">{stats.passCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Fail</p>
            <p className="text-2xl font-display text-destructive">
              {stats.failCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Processing Time</p>
            <p className="text-2xl font-display">
              {stats.avgProcessingTime.toFixed(1)} ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live View */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              Live View
              {isRunning && (
                <span className="flex items-center gap-1 text-xs font-normal text-success">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  Running
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted/50 rounded-xl overflow-hidden">
              <Image
                src="/assets/pc_blueprint.gif"
                alt="Live feed"
                fill
                className="object-cover"
              />
              {/* Detection Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {currentDetections.map((detection, i) => (
                  <g key={i}>
                    <rect
                      x={`${(detection.boundingBox.x / 640) * 100}%`}
                      y={`${(detection.boundingBox.y / 480) * 100}%`}
                      width={`${(detection.boundingBox.width / 640) * 100}%`}
                      height={`${(detection.boundingBox.height / 480) * 100}%`}
                      fill={`${detection.color}20`}
                      stroke={detection.color}
                      strokeWidth="2"
                    />
                    <rect
                      x={`${(detection.boundingBox.x / 640) * 100}%`}
                      y={`${((detection.boundingBox.y - 20) / 480) * 100}%`}
                      width="80"
                      height="18"
                      fill={detection.color}
                      rx="2"
                    />
                    <text
                      x={`${((detection.boundingBox.x + 4) / 640) * 100}%`}
                      y={`${((detection.boundingBox.y - 6) / 480) * 100}%`}
                      fill="white"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {detection.className} {(detection.confidence * 100).toFixed(0)}%
                    </text>
                  </g>
                ))}
              </svg>
              {!isRunning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-white">Click Start to begin inspection</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Log */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Results Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {results.slice(0, 20).map((result) => {
                const hasDefect = result.detections.some((d) => d.classId !== 0);
                return (
                  <div
                    key={result.id}
                    className={`p-2 rounded-lg text-xs ${
                      hasDefect
                        ? "bg-destructive/10 border border-destructive/30"
                        : "bg-success/10 border border-success/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">
                        {formatTime(result.timestamp)}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          hasDefect
                            ? "bg-destructive/20 text-destructive"
                            : "bg-success/20 text-success"
                        }
                      >
                        {hasDefect ? "FAIL" : "PASS"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.detections.map((d, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor: `${d.color}20`,
                            color: d.color,
                          }}
                        >
                          {d.className}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {result.processingTime}ms
                    </p>
                  </div>
                );
              })}
              {results.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No results yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
