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
const corList =JSON.parse(process.env.CORS_ORIGIN)
app.use(
  cors({
    origin: corList, //這邊改成他的伺服器(白名單)，有多個的時候用陣列表示
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
//登入檢查 中介程式
const loginCheckMiddle = require('./Modules/TokenLoginCheck')
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//會員登入
app.use('/login',require('./Modules/TokenLogin'))
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//天氣資料
app.use('/weathers',require('./API/Weather/GetAllWeatherData'))
//天氣資料 會員用
app.use('/memberWeathers',loginCheckMiddle,require('./API/Weather/MemberGetWeather'))
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//行程表 顯示
app.use('/getMemberSchedules',loginCheckMiddle,require('./API/Schedules/GetScheduleRender'))


app.use('/getPark',require('./Modules/Schedule/ParkingDatas'))

app.use('/getNearPark',require('./API/Parking/NearPark'))
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//計數器
app.use('/memberCounts',loginCheckMiddle,require('./API/Counts/Count'))

//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//假資料
app.use('/setFakeData',require('./Modules/FakeDatas'))
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//排程 nodeSchedule
//天氣
require('./Modules/Schedule/Wheather')()
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//伺服器啟動檢查
//天氣
// require('./Modules/StartCheck/Weather')()
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
  // moment.locale('ja')
  // console.log(moment(new Date()).format('LLLL'));
  console.log("路由伺服器啟動，埠號:", port);
  console.log("現在時間:" + new Date());
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
//404頁面 放最後
app.use((req, res) => {
  res.status(404).send("No Pages");
});
//※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※