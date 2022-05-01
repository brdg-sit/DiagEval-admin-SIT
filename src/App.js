import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

export default function App() {
  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10000,
    maxColumns: 10,
  });
  const [pageSize, setPageSize] = React.useState(100);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        pageSize={pageSize}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        pagination
        {...data}
      />
    </div>
  );
}
