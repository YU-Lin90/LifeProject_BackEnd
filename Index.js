//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//全域變數 .env檔
require("dotenv").config();
//伺服器系統
const express = require("express");
//檔案系統
const multer = require("multer");
//時區
const moment = require("moment-timezone");
//資料庫連線模組
const DB = require(__dirname + "/modules/ConnectDataBase");
//圖片上傳模組
const upload = require(__dirname + "/modules/Upload_Imgs");
//搬移檔案系統
const fs = require("fs").promises;
//UUID 隨機碼
const { v4: getv4 } = require("uuid");
//jwt登入驗證
const jwt = require("jsonwebtoken");
//隨機碼
const bcrypt = require('bcrypt')
//路由
const app = express();
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//跨來源請求
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.107:3000",
    ], //這邊改成他的伺服器(白名單)，有多個的時候用陣列表示
    optionsSuccessStatus: 200,
  })
);
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//檔頭解析 urlencoded
app.use(express.urlencoded({ extended: false }));
//檔頭解析 json
app.use(express.json());
//檔頭解析 formData
app.post(multer().none(), async (req, res) => {
  next();
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//會員登入
app.use('/login',require('./Modules/TokenLogin'))





//假資料
app.use('/setFakeData',require('./Modules/FakeDatas'))

app.get('/getTest',async (req, res) => {
  res.json(1)
});





//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//根目錄資料夾
app.use(express.static("Public"));
//上傳檔案路徑
app.use("/uploads", express.static("uploads"));
//圖片路徑
app.use("/images", express.static("Images"));
//設定PORT
const port = process.env.SERVER_PORT || 3001;
//設定監聽port
const server = app.listen(port, () => {
  console.log("路由伺服器啟動，埠號:", port);
  console.log("現在時間:" + new Date());
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//404頁面 放最後
app.use((req, res) => {
  res.status(404).send("No Pages");
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※