'use client';

import { useEffect, useState } from "react";
import { EntityTable } from "@commercialapp/ui";
import type { ColumnMeta } from "@commercialapp/ui";

type Berth = {
  id: number;
  berthName: string;
  terminalDock: string;
};

const columnsMeta: ColumnMeta<Berth>[] = [
  { key: "berthName", title: "Berth Name", isOptional: false },
  { key: "terminalDock", title: "Terminal/Dock", isOptional: false },
];

export default function BerthInfo() {
  const [data, setData] = useState<Berth[]>([]);
  const initialData: Berth[] = [
    {
      id: 1,
      berthName: "Berth 1",
      terminalDock: "Terminal 1",
    },
  ];

  useEffect(() => {
    setData(initialData);
  }, []);
  return (
    <div>
      <EntityTable<Berth>
        title="Berth Info"
        data={data}
        columnsMeta={columnsMeta}
        filterKey="berthName"
        showPagination={false}
      />
    </div>
  );
} 