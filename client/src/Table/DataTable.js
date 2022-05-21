import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./DataTable.css";
import { height } from "@mui/system";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const baseuri = "https://sitapi.brdg.kr/api/sit/";

const rows = [
  {
    id: 1,
    expense: "Light bill",
    price: 0,
    dueAt: new Date(2021, 6, 8),
    isPaid: false,
    paymentMethod: "",
  },
  {
    id: 2,
    expense: "Rent",
    price: 0,
    dueAt: new Date(2021, 7, 1),
    isPaid: false,
    paymentMethod: "",
  },
  {
    id: 3,
    expense: "Car insurance",
    price: 0,
    dueAt: new Date(2021, 7, 4),
    isPaid: true,
    paymentMethod: "Credit card",
  },
];

const columns = [
  { field: "expense", headerName: "Expense", width: 160, editable: true },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 120,
    editable: true,
  },
  {
    field: "dueAt",
    headerName: "Due at",
    type: "date",
    width: 120,
    editable: true,
  },
  {
    field: "isPaid",
    headerName: "Is paid?",
    type: "boolean",
    width: 140,
    editable: true,
  },
  {
    field: "paymentMethod",
    headerName: "Payment method",
    type: "singleSelect",
    valueOptions: ["Credit card", "Wire transfer", "Cash"],
    width: 160,
    editable: true,
  },
];

const typLoadGridCols = [
  { field: "mnth", headerName: "월", width: 50 },
  {
    field: "load_gas",
    headerName: "가스사용량",
    width: 100,
    type: "number",
  },
  {
    field: "unit_gas",
    headerName: "단위",
    width: 50,
    type: "string",
  },
  {
    field: "load_elec",
    headerName: "전기사용량",
    width: 100,
    type: "number",
  },
  {
    field: "unit_elec",
    headerName: "단위",
    width: 50,
    type: "string",
  },
  {
    field: "id",
    headerName: "id",
    width: 50,
    hideable: false,
    hide: true,
  },
  {
    field: "id_etr",
    headerName: "id_etr",
    width: 50,
    hideable: false,
    hide: true,
  },
];

// loads.push({
//   id: d.id,
//   mnth: d.mnth,
//   load_cool: d.load_cool,
//   unit_cool: d.unit_cool,
//   load_heat: d.load_heat,
//   unit_heat: d.unit_heat,
//   load_baseElec: d.load_baseElec,
//   unit_baseElec: d.unit_baseElec,
//   load_baseGas: d.load_baseGas,
//   unit_baseGas: d.unit_baseGas,
//   id_etr: d.id_etr,
// });

const usgLoadGridCols = [
  { field: "mnth", headerName: "월", width: 50 },
  { field: "load_cool", headerName: "냉방", width: 100, type: "number" },
  { field: "unit_cool", headerName: "단위", width: 50, type: "string" },
  { field: "load_heat", headerName: "난방", width: 100, type: "number" },
  { field: "unit_heat", headerName: "단위", width: 50, type: "string" },
  { field: "load_baseElec", headerName: "기저", width: 100, type: "number" },
  { field: "unit_baseElec", headerName: "단위", width: 50, type: "string" },
  {
    field: "load_baseGas",
    headerName: "급탕/취사",
    width: 100,
    type: "number",
  },
  {
    field: "unit_baseGas",
    headerName: "단위",
    width: 50,
    type: "string",
  },
  { field: "id", headerName: "id", width: 50, hideable: false, hide: true },
  {
    field: "col7",
    headerName: "id_etr",
    width: 50,
    hideable: false,
    hide: true,
  },
];

const DataTable = () => {
  const [dataUserEnter, setDataUserEnter] = useState([]);
  const [editUserEnter, setEditUserEnter] = useState([]);
  const [headerUserEnter, setHeaderUserEnter] = useState([]);
  const [dataTypLoad, setDataTypLoad] = useState([]);
  const [dataUsgLoad, setDataUsgLoad] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [snackbar, setSnackbar] = useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    fetchTableHeader();
    fetchTableUserData();
    //handleGetLoad();
  }, []);

  const fetchTableHeader = async () => {
    var url = new URL(baseuri + "tableinfo");
    var params = { nmTable: "tbl_user_enter" };
    url.search = new URLSearchParams(params).toString();

    await fetch(url)
      .then((data) => data.json())
      .then((data) => setHeaderUserEnter(data));

    // console.log(headers);

    // let newHeaders = [];
    // for (let i = 0; i < headers.length; i++) {
    //   const header = headers[i];
    //   if (header.field === "cd_north_axis") {
    //     header.type = "singleSelect";
    //     header.valueOptions = ["Credit card", "Wire transfer", "Cash"];
    //   }
    //   newHeaders.push(header);
    // }

    // console.log(newHeaders);

    // setHeaderUserEnter(newHeaders);

    //setHeaderUserEnter(headers)

    // console.log(headerUserEnter);

    // setHeaderUserEnter((header) => [
    //   ...header,
    //   { field: "edited", headerName: "edited" },
    // ]);
  };

  const fetchTableData = async () => {
    var url = new URL(baseuri + "mldata");

    await fetch(url)
      .then((data) => data.json())
      .then((data) => setDataUserEnter(data));
  };

  const fetchTableUserData = async () => {
    var url = new URL(baseuri + "userdata");

    await fetch(url)
      .then((data) => data.json())
      .then((data) => setDataUserEnter(data));
  };

  const handleGetLoad = async (e) => {
    const postData = {
      id: e.row.id,
    };

    try {
      const res = await fetch(baseuri + "typload", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      let loads = [];
      for (let i = 0; i < data.length; i++) {
        const d = data[i];

        loads.push({
          id: d.id,
          mnth: d.mnth,
          load_gas: d.load_gas,
          unit_gas: d.unit_gas,
          load_elec: d.load_elec,
          unit_elec: d.unit_elec,
          id_etr: d.id_etr,
        });
      }
      setDataTypLoad(loads.map((row) => ({ ...row })));
    } catch (err) {
      console.log(err);
    }

    try {
      const res = await fetch(baseuri + "usgload", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      let loads = [];
      for (let i = 0; i < data.length; i++) {
        const d = data[i];

        loads.push({
          id: d.id,
          mnth: d.mnth,
          load_cool: d.load_cool,
          unit_cool: d.unit_cool,
          load_heat: d.load_heat,
          unit_heat: d.unit_heat,
          load_baseElec: d.load_baseElec,
          unit_baseElec: d.unit_baseElec,
          load_baseGas: d.load_baseGas,
          unit_baseGas: d.unit_baseGas,
          id_etr: d.id_etr,
        });
      }
      setDataUsgLoad(loads.map((row) => ({ ...row })));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (selectionModel.length === 0) {
      return;
    }

    let postData = { id: [] };
    for (let i = 0; i < selectionModel.length; i++) {
      const model = selectionModel[i];
      postData.id.push(model);
    }
    console.log(postData);

    try {
      const res = await fetch(baseuri + "delete", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    fetchTableUserData();
    setDataTypLoad([]);
    setDataUsgLoad([]);
  };

  const fetchSave1 = async (row) => {
    let postData = { id: row.id };

    console.log(postData);

    try {
      const res = await fetch(baseuri + "save", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    fetchTableUserData();
    setDataTypLoad([]);
    setDataUsgLoad([]);
  };

  let idCounter = 0;
  const createRow = () => {
    idCounter = dataUserEnter[dataUserEnter.length - 1].id + 1;
    console.log(
      "const createRow = () => {",
      dataUserEnter[dataUserEnter.length - 1].id,
      idCounter
    );
    return { id: idCounter };
  };

  const handleAddRow = () => {
    console.log("const handleAddRow = () => {");
    //console.log(headerUserEnter);
    //console.log(dataUserEnter);
    //setDataUserEnter([createRow()]);
    //console.log(dataUserEnter);

    console.log(dataUserEnter);

    // const headers = []
    // for (let i = 0; i < headerUserEnter.length; i++) {
    //   const element = headerUserEnter[i];

    //   if (element.field === "cd_north_axis"){
    //     element.type = "singleSelect"
    //     element.valueOptions = ["a", "b", "c"]
    //     console.log(element);
    //   }
    //   headers.push(element)
    // }

    // setHeaderUserEnter(headers);

    // setHeaderUserEnter(
    //   (headerUserEnter.filter(
    //     (column) => column.field === "cd_north_axis"
    //   ).type = "singleSelect")
    // );
    // setHeaderUserEnter(
    //   (headerUserEnter.filter(
    //     (column) => column.field === "cd_north_axis"
    //   ).valueOptions = ["a", "b", "c"])
    // );

    // for (let i = 0; i < headerUserEnter.length; i++) {
    //   const col = headerUserEnter[i];

    //   if (col.field === "cd_north_axis") {
    //     col.type = "singleSelect";
    //     col.valueOptions = ["United Kingdom", "Spain", "Brazil"];
    //   }
    // }
    // console.log(headerUserEnter);
    console.log("const handleAddRow = () => { end");
  };

  const handleEditStart = (params, event) => {
    console.log("const handleEditStart = () => { start");

    // for (let i = 0; i < params.columns.length; i++) {
    //   const col = params.columns[i];

    //   if (col.field === "cd_north_axis") {
    //     col.type = "singleSelect";
    //     col.valueOptions = ["United Kingdom", "Spain", "Brazil"];
    //   }
    // }
    console.log(params.columns);
    console.log("const handleEditStart = () => { end");
  };

  const handleEditStop = (params, event) => {
    console.log("const handleEditStop = () => { start");
    console.log("const handleEditStop = () => { end");
  };

  const useFetchSave = () => {
    return React.useCallback((user) => {
      console.log(user);
      let postData = user;
      return fetch(baseuri + "save", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }).then((result) => {
        console.log(result);
        return user;
      });
    }, []);
  };

  const handleSave = useFetchSave();

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      // Make the HTTP request to save in the backend
      const response = await handleSave(newRow);
      setSnackbar({ children: "User successfully saved", severity: "success" });
      return response;
    },
    [handleSave]
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  return (
    <div style={{ margin: "10px" }}>
      <div className="area_menu">
        <div
          style={{
            height: "40px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          관리자
        </div>
        <button style={{ height: "30px", float: "right", margin: "5px" }}>
          재 학습
        </button>
      </div>
      <div style={{ display: "flex", height: "800px" }}>
        <div style={{ width: "70%", margin: "0px 20px 0px 0px" }}>
          <div
            style={{
              height: "40px",
              display: "inline-block",
            }}
          >
            사용자 입력 데이터
          </div>
          <button
            style={{ height: "30px", float: "right", margin: "5px" }}
            //onClick={handleDelete}
          >
            삭제
          </button>
          <button
            style={{ height: "30px", float: "right", margin: "5px" }}
            //onClick={handleSave}
          >
            저장
          </button>
          <button
            style={{ height: "30px", float: "right", margin: "5px" }}
            //onClick={handleAddRow}
          >
            추가
          </button>
          <div style={{ height: "100%" }}>
            <DataGrid
              rows={dataUserEnter}
              columns={headerUserEnter}
              rowHeight={35}
              pageSize={100}
              rowsPerPageOptions={[100]}
              //checkboxSelection
              onRowClick={handleGetLoad}
              //editMode="row"
              //experimentalFeatures={{ newEditingApi: true }}
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              // onRowEditStart={(params, event) => {
              //   handleEditStart(params, event);
              //   console.log("onRowEditStart");
              // }}
              // onRowEditStop={(params, event) => {
              //   handleEditStop(params, event);
              //   console.log("onRowEditStop");
              // }}
              //processRowUpdate={processRowUpdate}
              // onProcessRowUpdateError={handleProcessRowUpdateError}
              selectionModel={selectionModel}
            />
            {!!snackbar && (
              <Snackbar
                open
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
              >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}
          </div>
        </div>
        <div style={{ flexGrow: "1", height: "auto" }}>
          <div style={{ height: "auto" }}>
            <div
              style={{
                height: "40px",
                display: "inline-block",
              }}
            >
              월별 사용량
            </div>
            <button style={{ height: "30px", float: "right", margin: "5px" }}>
              저장
            </button>
            <div style={{ height: "370px", margin: "0px 0px 20px 0px" }}>
              <DataGrid
                rows={dataTypLoad}
                columns={typLoadGridCols}
                rowHeight={35}
                pageSize={100}
                rowsPerPageOptions={[100]}
              />
            </div>
            <div
              style={{
                height: "40px",
                display: "inline-block",
              }}
            >
              월별 분리분산 사용량
            </div>
            <button style={{ height: "30px", float: "right", margin: "5px" }}>
              저장
            </button>
            <div style={{ height: "370px" }}>
              <DataGrid
                rows={dataUsgLoad}
                columns={usgLoadGridCols}
                rowHeight={35}
                pageSize={100}
                rowsPerPageOptions={[100]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
