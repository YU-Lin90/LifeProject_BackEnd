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
    success: false,
    errorType: "",
  };

  const sql =
    "SELECT `sid`, `city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition`, `city_order` FROM `weather_forecast` WHERE `city_order` > 0 ";
  try {
    const [result] = await DB.query(sql);
    const timeForm = "DD日HH時";
    for (let element of result) {
      element.start_time = changeTime(element.start_time, timeForm);
      element.end_time = changeTime(element.end_time, timeForm);
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

    output.data = datas;
    output.success = true;
    return res.json(output);
  } catch (error) {
    console.log(error);
    output.errorType = "ServerError";
    return res.json(output);
  }
});

//單縣市全部預報
router.get("/getOne", async (req, res) => {
  const output = {
    success: false,
    errorType: "",
  };
  const city = req.query.city;
  if (!city || city.length !== 3) {
    output.errorType = "NotCitys";
    res.json(output);
  }
  const sql =
    "SELECT  `city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition`, `city_order` FROM `weather_forecast` WHERE `city_name` = ?  ";
  try {
    const [result] = await DB.query(sql, city);
    const timeForm = "DD日HH時";
    for (let element of result) {
      element.start_time = changeTime(element.start_time, timeForm);
      element.end_time = changeTime(element.end_time, timeForm);
    }
    output.success = true;
    output.data = result;
    return res.json(output);
  } catch (error) {
    output.errorType = "ServerError";
    return res.json(output);
  }
});

module.exports = router;
