const DB = require("../../Modules/ConnectDataBase");
const moment = require("moment-timezone");
const axios = require('axios');
const CwbKey = process.env.CWB_KEY
const checkWeather = async ()=>{
  const {data} = await axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${CwbKey}&format=JSON&sort=time&locationName=新北市`)
  const datas = data.records.location;
  for (let element of datas){
    //locationName  縣市名稱
    const {locationName,weatherElement} = element
    // console.log(locationName);
    // console.log(weatherElement);
    const [{time:weather_condition}] = weatherElement.filter((v)=>{return v.elementName==='Wx'})
    console.log({weather_condition});
    const [{time:humidity}] = weatherElement.filter((v)=>{return v.elementName==='PoP'})
    console.log({humidity});
    const [{time:temp_min}] = weatherElement.filter((v)=>{return v.elementName==='MinT'})
    console.log({temp_min});
    const [{time:temp_max}] = weatherElement.filter((v)=>{return v.elementName==='MaxT'})
    console.log({temp_max});
    const [{time:feeling_condition}] = weatherElement.filter((v)=>{return v.elementName==='CI'})
    console.log({feeling_condition});


  }
}

module.exports = checkWeather;