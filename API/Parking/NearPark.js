const express = require("express");
const router = express();
const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}
router.get("/", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================
    //這裡輸入要做的事(資料庫連結、發AJAX...)
    const lat = req.query.lat
    const lng = req.query.lng
    const maxDistance = req.query.maxDistance
    //無QUERY資訊
    if(!lat||!lng||!maxDistance){
      output.errorType='DataError'
      return res.json(output)
    }
    const sql = "SELECT  `name`,`sid`,`address`,`phone`,`average_evaluation`, `shop_lat`,`shop_lng`,(6378.137 *  2 * asin(SQRT(sin(((( ? - `shop_lat`) / 2) * PI()) / 180) * sin((( ( ? - `shop_lat`)  / 2) * PI()) / 180) + cos(( `shop_lat`  * PI()) / 180) * cos((? * PI()) / 180) * sin((((? - `shop_lng`) / 2) * PI()) / 180) * sin((( (  ?  -  `shop_lng`)  / 2) * PI()) / 180) ))) DE  FROM `shop` WHERE  6378.137 *  2 * asin(SQRT(sin(((( ? - `shop_lat`) / 2) * PI()) / 180) * sin((( ( ? - `shop_lat`)  / 2) * PI()) / 180) + cos(( `shop_lat`  * PI()) / 180) * cos((? * PI()) / 180) * sin((((? - `shop_lng`) / 2) * PI()) / 180) * sin((( (  ?  -  `shop_lng`)  / 2) * PI()) / 180) )) <? ORDER BY DE"
    const [result] = await DB.query(sql,[lat,lat,lng,lng,lng,lat,lat,lng,lng,lng,maxDistance])
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