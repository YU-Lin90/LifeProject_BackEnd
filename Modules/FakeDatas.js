const express = require("express");
const router = express.Router();
const DB = require("./ConnectDataBase");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt")

router.get("/updatePass", async (req, res) => {
  const hashedPass= await bcrypt.hash('123456',10)
  const sql = "UPDATE `member` SET `password`=? WHERE `sid` = 1"
  await DB.query(sql,hashedPass)
  res.json(1)
})

router.use("/check", async (req, res) => {
  const sql = "SELECT `password` FROM `member` WHERE `sid` = 1"
  const [[{password}]] = await DB.query(sql,)
  //這邊直接用轉換前的字串比較
  const bools = await bcrypt.compare('123456',password)
  console.log(bools);
  res.json(bools)
})

module.exports = router;
