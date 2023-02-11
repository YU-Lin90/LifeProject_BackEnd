const express = require("express");
const router = express();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}

//===============================================分隔線================================================
//創建欄位  C
router.get("/createNewRow", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  const memberSid = req.token.sid
  
  const countName = req.query.countName

  const startValue = req.query.startValue

  try {
    //===============================================分隔線================================================
    

    const sql = "INSERT INTO `counts`( `member_sid`,`count`, `count_name`) VALUES (?,?,?)"
    const insertData = [memberSid,startValue,countName]
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})
//===============================================分隔線================================================
//獲得資訊  R
router.get("/getOldDatas", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================    

    const sql = "SELECT * FROM `counts` WHERE 1"
    const insertData = []
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})
//===============================================分隔線================================================
//變更  U
router.get("/setCounts", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================
    const sql = "UPDATE `counts` SET `count_name`=?,`count`=? WHERE `sid` = ? AND `member_sid`=?"
    const insertData = []
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})

//===============================================分隔線================================================
//刪除  D
router.get("/deleteRow", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================
    const sql = "UPDATE `counts` SET `valid`= 0  WHERE `sid` = ? AND `member_sid`=?"
    const insertData = []
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})


module.exports = router;