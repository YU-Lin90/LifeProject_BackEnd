const express = require("express");
const router = express();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}
router.use("/", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  const memberSid = req.token.sid
  try {
    //===============================================分隔線================================================
    const sql = "SELECT `title`, `start_time` start, `end_time` end, `isAllday` allDay FROM `schedules` WHERE `member_sid` = ?"
    const insertData = [memberSid]
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
    const form = 'YYYY-MM-DD HH:mm:ss'
    for (const element of result) {
      // element.start = changeTime(element.start, form)
       element.start = new Date(element.start)
       element.end= new Date(element.end)
      // element.end = changeTime(element.end, form)

      element.allDay = !!element.allDay
      if(!element.allDay){
       delete element.allDay
      }
    }
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    console.log(error);
    return res.json(output)
  }
})

module.exports = router;