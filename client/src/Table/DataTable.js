import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./DataTable.css";

const baseuri = "https://sitapi.brdg.kr/api/sit/";

const loadGridCols = [
  { field: "col1", headerName: "월", width: 150 },
  { field: "col2", headerName: "가스사용량", width: 100, type: "number" },
  { field: "col3", headerName: "전기사용량", width: 100, type: "number" },
  { field: "col4", headerName: "id", width: 50, hideable: false, hide: true },
];

const DataTable = () => {
  const [dataUserEnter, setDataUserEnter] = useState([]);
  const [headerUserEnter, setHeaderUserEnter] = useState([]);
  const [dataLoad, setDataLoad] = useState([]);
  const [headerLoad, setHeaderLoad] = useState([]);

  const fetchTableHeader = async () => {
    var url = new URL(baseuri + "tableinfo");
    var params = { nmTable: "tbl_user_enter" };
    url.search = new URLSearchParams(params).toString();

    await fetch(url)
      .then((data) => data.json())
      .then((data) => setHeaderUserEnter(data));
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

  useEffect(() => {
    fetchTableHeader();
    fetchTableUserData();
    //handleGetLoad();
  }, []);

  const handleGetLoad = async (e) => {
    const postData = {
      id: e.row.id,
    };
    console.log(postData);

    try {
      const res = await fetch(baseuri + "load", {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        referrerPolicy: 'no-referrer',
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
          col1: d.mnth,
          col2: d.load_gas,
          col3: d.load_elec,
          col4: d.id_etr,
        });
      }
      setDataLoad(loads.map((row) => ({ ...row })));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="area_top">
        <div className="buttonArea">
          <button className="button">저장</button>
        </div>
      </div>
      <div className="area_bottom">
        <div className="area_grid1">
          <div className="area_button_grid">
            <span className="title_grid">제목1</span>
            <button className="button_inside">저장</button>
          </div>
          <div className="grid">
            <DataGrid
              rows={dataUserEnter}
              columns={headerUserEnter}
              pageSize={100}
              checkboxSelection
              onRowClick={handleGetLoad}
            />
          </div>
        </div>
        <div className="area_grid2">
          <div className="area_button_grid">
            <span>제목1</span>
            <button className="button_inside">저장</button>
          </div>
          <div className="grid">
            <DataGrid
              rows={dataLoad}
              columns={loadGridCols}
              pageSize={100}
              checkboxSelection
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
