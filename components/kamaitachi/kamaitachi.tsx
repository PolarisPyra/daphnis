"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { getTachiExport } from "./action";

const KamaitachiExport = () => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const result = await getTachiExport();

      if (result) {
        const exportedFile = new Blob([JSON.stringify(result, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(exportedFile);
        const kamafile = document.createElement("a");
        kamafile.href = url;
        kamafile.download = "kamaitachi.json";
        document.body.appendChild(kamafile);
        kamafile.click();
        document.body.removeChild(kamafile);

        toast({
          title: "Success",
          description: "Data exported successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to export data",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while exporting data",
      });
    }
  };

  return (
    <Card x-chunk="aimecard">
      <CardHeader>
        <CardTitle className="text-2xl">Export to kamaitachi</CardTitle>
      </CardHeader>

      <CardContent>
        <Button onClick={handleExport} className="w-full">
          Export
        </Button>
      </CardContent>
    </Card>
  );
};

export { KamaitachiExport };
