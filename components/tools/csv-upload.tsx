"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UPLOAD_CONSTANTS } from "@/config/constants";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

type CSVUploadProps = {
  onDataProcessed: (data: string[][]) => void;
  accept?: string;
  maxFileSize?: number;
  className?: string;
};

export function CSVUpload({
  onDataProcessed,
  accept = ".csv",
  maxFileSize = UPLOAD_CONSTANTS.MAX_FILE_SIZE,
  className = "",
}: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    if (file.size > maxFileSize) {
      setError(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    try {
      const text = await file.text();
      const rows = text
        .split("\n")
        .map((row) =>
          row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")),
        )
        .filter((row) => row.some((cell) => cell.length > 0));

      setFileName(file.name);
      setError(null);
      onDataProcessed(rows);
    } catch (err) {
      setError("Error processing CSV file");
      console.error("CSV processing error:", err);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleReset = () => {
    setFileName(null);
    setError(null);
  };

  return (
    <Card
      className={`${className} ${isDragging ? "border-primary" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        {fileName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{fileName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={handleReset}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="mb-2 text-sm font-medium">
              Drag & drop your CSV file here, or click to browse
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </>
        )}
        {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
      </CardContent>
    </Card>
  );
}
