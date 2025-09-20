"use client";

import React from "react";
import { Checkbox } from "@commercialapp/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@commercialapp/ui";
import { Label } from "@commercialapp/ui";

export interface PortFormData {
  secaZone: boolean;
  offshoreOpa: boolean;
  europe: boolean;
  bunkerPort: boolean;
  warRiskArea: boolean;
  historical: boolean;
}

interface CheckboxesProps {
  form: PortFormData;
  setForm: React.Dispatch<React.SetStateAction<PortFormData>>;
}

export function CheckboxGrid({ form, setForm }: CheckboxesProps) {
  const options = [
    { key: "secaZone", label: "SECA zone" },
    { key: "offshoreOpa", label: "Offshore (OPA)" },
    { key: "europe", label: "Europe" },
    { key: "bunkerPort", label: "Bunker Port" },
    { key: "warRiskArea", label: "War Risk Area" },
    { key: "historical", label: "Historical" },
  ] as const;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Port Attributes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
            >
              <Checkbox
                id={key}
                checked={form[key]}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, [key]: !!checked }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
