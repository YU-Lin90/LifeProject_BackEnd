const express = require("express");
const router = express();
const DB = require("../ConnectDataBase");
const moment = require("moment-timezone");
const axios = require('axios')
function changeTime(oldTime, form) {
  return moment(oldTime).tz("Asia/Taipei").format(form);
}
router.use("/", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  try {
    //===============================================分隔線================================================
    //這裡輸入要做的事(資料庫連結、發AJAX...)
    //https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json
    const { data } = await axios.get(
      `https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json`
    );
    const parkList = data.data.park
    /**AVAILABLE：停車場（汽車）目前之剩餘車位數，要是數值等於-9，表
示本停車場目前無法提供即時車位數資訊。
 */
    /* {
      "id" : "001",
      "area" : "信義區",
      "name" : "府前廣場地下停車場",
      "type" : "1",  TYPE: 1:動態停車場(可取得目前剩餘車位數) 2:靜態停車場
TYPE2: 1:停管處經營 2:非停管處經營

      "type2" : "2",
      "summary" : "為地下二層停車場，計有1998個小型車停車格，1337個機車停車位",
      "address" : "松壽路1號地下",
      "tel" : "2722-0152",
      "payex" : "小型車全日月票4200元，夜間月票1000元(限周一至周五19-8，及周六、日與行政機關放假之紀念日、民俗日)，小型車計時30元(9-18)，夜間計時10元(18-9)；機車計時10元(當日當次上限20元)，機車月票300元。111/11/26、11/27、12/3、12/4、12/10、12/11、12/17、12/18、12/24、12/25、12/31、112/1/1、1/2、1/8、1/14、1/15，10-20時，調整小型車費率，計時60元。",
      "serviceTime" : "00:00:00~23:59:59", 
      "tw97x" : "306812.928",
      "tw97y" : "2769892.95",
      "totalcar" : 2043,
      "totalmotor" : 1360,
      "totalbike" : 0,
      "totalbus" : 0,
      "Pregnancy_First" : "40",
      "Handicap_First" : "45",
      "Taxi_OneHR_Free" : "0",
      "AED_Equipment" : "0",
      "CellSignal_Enhancement" : "0",
      "Accessibility_Elevator" : "0",
      "Phone_Charge" : "0",
      "Child_Pickup_Area" : "0",
      "FareInfo" : {
        "WorkingDay" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~18",
          "Fare" : "30"
        }, {
          "Period" : "18~24",
          "Fare" : "10"
        } ],
        "Holiday" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~18",
          "Fare" : "30"
        }, {
          "Period" : "18~24",
          "Fare" : "10"
        } ]
      },
      "EntranceCoord" : {
        "EntrancecoordInfo" : [ {
          "Xcod" : "25.03648987",
          "Ycod" : "121.5621068",
          "Address" : "基隆路一段"
        }, {
          "Xcod" : "25.036014",
          "Ycod" : "121.563163",
          "Address" : "松壽路"
        }, {
          "Xcod" : "25.035975",
          "Ycod" : "121.561532",
          "Address" : "基隆路一段車行地下道"
        } ]
      }
    } */
    
    for(let element of parkList){
      for (let keyName in element){
        const searchSql = "SELECT * FROM `getallkeys` WHERE `keyName` = ?"
        const [searchResult] = await DB.query(searchSql,keyName)
        if(searchResult&&searchResult.length===0){
          const insertSql = "INSERT INTO `getallkeys`(`keyName`) VALUES (?)"
          const res = await DB.query(insertSql,keyName)
        }
      }
    }
    // console.log(data);
    return res.json(1)
    const sql = ""
    const insertData = []
    const [result] = await DB.query(sql,insertData)
    //===============================================分隔線================================================
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