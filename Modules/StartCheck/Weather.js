const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
const axios = require("axios");
const CwbKey = process.env.CWB_KEY;
const checkWeather = async () => {
  const { data } = await axios.get(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${CwbKey}&format=JSON&sort=time`
  );
  const datas = data.records.location;
  //各城市資料
  for (let element of datas) {
    //locationName  縣市名稱
    const { locationName, weatherElement } = element;
    // console.log(locationName);
    // console.log(weatherElement);
    //===============================================分隔線================================================
    const [{ time: weather_condition }] = weatherElement.filter((v) => {
      return v.elementName === "Wx";
    });
    // console.log({ weather_condition });
    //===============================================分隔線================================================
    const [{ time: precipitation }] = weatherElement.filter((v) => {
      return v.elementName === "PoP";
    });
    // console.log({ precipitation });
    //===============================================分隔線================================================
    const [{ time: temp_min }] = weatherElement.filter((v) => {
      return v.elementName === "MinT";
    });
    // console.log({ temp_min });
    //===============================================分隔線================================================
    const [{ time: temp_max }] = weatherElement.filter((v) => {
      return v.elementName === "MaxT";
    });
    // console.log({ temp_max });
    //===============================================分隔線================================================
    const [{ time: feeling_condition }] = weatherElement.filter((v) => {
      return v.elementName === "CI";
    });
    // console.log({ feeling_condition });
    //===============================================分隔線================================================
    const insertSql =
    "INSERT INTO `weather_forecast`(`city_name`, `start_time`, `end_time`, `precipitation`, `weather_condition`, `temp_max`, `temp_min`, `feeling_condition`, `city_order`) VALUES (?,?,?,?,?,?,?,?,?)";
    const updateSql = "UPDATE `weather_forecast` SET `start_time`=?,`end_time`=?,`precipitation`=?,`weather_condition`=?,`temp_max`=?,`temp_min`=?,`feeling_condition`=? WHERE `city_name` = ? AND `city_order` = ?"
    for(let i = 0;i<3;i++){
      const insertStartTime = weather_condition[i].startTime
      const insertEndTime = weather_condition[i].endTime;
      const insertPrecipitation = precipitation[i].parameter.parameterName
      const insertWeather_condition = weather_condition[i].parameter.parameterName
      const insertTemp_max = temp_max[i].parameter.parameterName
      const insertTemp_min = temp_min[i].parameter.parameterName
      const insertFeeling_condition = feeling_condition[i].parameter.parameterName
      const insertCity_order = i + 1
      const insertDatas = [insertStartTime,insertEndTime,insertPrecipitation,insertWeather_condition,insertTemp_max,insertTemp_min,insertFeeling_condition,locationName,insertCity_order]
      const [result] = await DB.query(updateSql,insertDatas)
      // console.log(result);
    } 

    /* 
    {
      "startTime": "2022-12-12 12:00:00",
      "endTime": "2022-12-12 18:00:00",
      "parameter": {
          "parameterName": "稍有寒意"
      }}
  */
      //這裡還在FOR迴圈內
    //===============================================分隔線================================================
  }
  const upDateTimeSql = "UPDATE `weather_forecast` SET `start_time`=NOW() WHERE `city_order` = 0 AND `sid` = 1"
  const [result] = await DB.query(upDateTimeSql)
  console.log(result);
};

module.exports = checkWeather;
