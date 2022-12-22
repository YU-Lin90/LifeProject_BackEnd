const express = require("express");
const router = express.Router();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");

function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}
//    weathers/
router.get("/getAll", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  //這是最接近現在的預報
  const sql = "SELECT `sid`, `city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition` `city_order` FROM `weather_forecast` WHERE `city_order` > 0 AND  city_order = 3 GROUP BY(`city_name`)"
  try {
    const [result] = await DB.query(sql)
    const timeForm = 'MM月DD日HH時'
    for(let element of result){
      element.start_time = changeTime(element.start_time,timeForm)
      element.end_time = changeTime(element.end_time,timeForm)
    }
    output.data = result
    output.success = true
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})

//單縣市全部預報
router.get("/getOne", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  const city = req.query.city
  if(!city||city.length!==3){
    output.errorType='NotCitys'
    res.json(output)
  }
  const sql = "SELECT  `city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition`, `city_order` FROM `weather_forecast` WHERE `city_name` = ?  "
  try {
    const [result] = await DB.query(sql,city)
    const timeForm = 'MM月DD日HH時'
    for(let element of result){
      element.start_time = changeTime(element.start_time,timeForm)
      element.end_time = changeTime(element.end_time,timeForm)
    }
    output.success=true
    output.data = result
    return res.json(output)
  } catch (error) {
    output.errorType = 'ServerError'
    return res.json(output)
  }
})

module.exports = router;