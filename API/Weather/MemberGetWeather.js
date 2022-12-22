const express = require("express");
const router = express();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}
//需要登入的叫天氣資料
//memberWeathers

//   memberWeathers/getFavriteCity
router.get("/getFavoriteCity", async (req, res) => {
  const memberSid = req.token.sid
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================
    const sql = "SELECT `citys` FROM `weather_member_favorite` WHERE `member_sid` = ?"
    const [cityList] = await DB.query(sql,memberSid)
    if(cityList.length===0){
      output.errorType = 'NoFavorite'
      return res.json(output)
    }
    // console.log(cityList);
    let baseSql = ""
    cityList.forEach((v,i)=>{
      const cityName = v.citys
      if(i!==0){
        baseSql += ' OR `city_name` LIKE ' + DB.escape(v.citys) + ' '
      }
      else{
        baseSql += ' `city_name` LIKE  ' +DB.escape(v.citys) + ' ' 
      }
    })
    
    const getDetailSql = "SELECT `city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition`, `city_order` FROM `weather_forecast` WHERE " + baseSql

    const [result] = await DB.query(getDetailSql)
    const timeForm = 'DD日HH時'
    for(let element of result){
      element.start_time = changeTime(element.start_time,timeForm)
      element.end_time = changeTime(element.end_time,timeForm)
    }
    const firstOrder = result.filter((v) => v.city_order === 1);
    const secondOrder = result.filter((v) => v.city_order === 2);
    const thirdOrder = result.filter((v) => v.city_order === 3);
    // console.log(firstOrder);
    const firstTimes = {
      start: firstOrder[0].start_time,
      end: firstOrder[0].end_time,
      order:1
    };
    const secondTimes = {
      start: secondOrder[0].start_time,
      end: secondOrder[0].end_time,
      order:2
    };
    const thirdTimes = {
      start: thirdOrder[0].start_time,
      end: thirdOrder[0].end_time,
      order:3
    };
    const datas = {
      details: [ {},firstOrder, secondOrder, thirdOrder ],
      timeSets: [ firstTimes, secondTimes, thirdTimes ],
    };
    output.success=true
    output.data = datas
    return res.json(output)
  } catch (error) {
    console.log(error);
    output.errorType = 'ServerError'
    return res.json(output)
  }
})

module.exports = router;