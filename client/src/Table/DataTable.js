import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);

  const [rows, setRows] = useState(tableData);
  const [deletedRows, setDeletedRows] = useState([]);

  const fetchTableHeader = async () => {
    await fetch("http://sitapi.brdg.kr/api/sit/tableinfo")
      .then((data) => data.json())
      .then((data) => setTableHeader(data));
  };

  const fetchTableData = async () => {
    await fetch("http://sitapi.brdg.kr/api/sit/mldata")
      .then((data) => data.json())
      .then((data) => setTableData(data));
  };

  useEffect(() => {
    fetchTableHeader();
    fetchTableData();
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
