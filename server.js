const fs = require("fs");
const express = require("express");
const asyncify = require("express-asyncify");
const bodyParser = require("body-parser");
const app = asyncify(express());
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

// app.get("/api/customers", (req, res) => {
//   connection.query("SELECT * FROM TBL_ML", (err, rows, fields) => {
//     res.send(rows);
//   });
// });

app.get("http://sitapi.brdg.kr/api/sit/mldata", async (req, res) => {
  await connection.query("SELECT * FROM TBL_ML", (err, rows, fields) => {
    res.send(rows);
  });
});

app.get("/api/tableinfo", async (req, res) => {
  await connection.query("SELECT name as field, label as headerName FROM tbl_def_cols", (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));