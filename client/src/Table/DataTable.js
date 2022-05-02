import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);

  const [rows, setRows] = useState(tableData);
  const [deletedRows, setDeletedRows] = useState([]);

  const fetchTableData = async () => {
    await fetch("/api/learningdata")
      .then((data) => data.json())
      .then((data) => setTableData(data));
  };

  const fetchTableHeader = async () => {
    await fetch("/api/tableinfo")
      .then((data) => data.json())
      .then((data) => setTableHeader(data));
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    fetchTableHeader();
  }, []);

  return (
    <div style={{ height: 900, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={tableHeader}
        pageSize={100}
        checkboxSelection
        disableSelectionOnClick
        // onSelectionModelChange={({ selectionModel }) => {
        //   const rowIds = selectionModel.map((rowId) =>
        //    parseInt(String(rowId), 10)
        //   );
        //   const rowsToDelete = tableData.filter((row) =>
        //    rowIds.includes(row.id)
        //   );
        //   setDeletedRows(rowsToDelete);
        //   console.log(deletedRows);
        // }}
      />
    </div>
  );
};

export default DataTable;
