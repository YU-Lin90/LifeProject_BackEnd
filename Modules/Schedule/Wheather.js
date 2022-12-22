const nodeSchedule  = require('node-schedule')

const updateWeatherData = require('../StartCheck/Weather')

//天氣資料更新預報排程
//https://ithelp.ithome.com.tw/articles/10243928

const setSchedule = async ()=>{
  const updateWeatherDataTask1 = '0 30 0 * * *'
  const updateWeatherDataTask2 = '0 30 6 * * *'
  const updateWeatherDataTask3 = '0 30 12 * * *'
  const updateWeatherDataTask4 = '0 30 18 * * *'

  const updateWeatherData1 = nodeSchedule.scheduleJob(updateWeatherDataTask1,async ()=>{
    await updateWeatherData()
    console.log('updateWeatherAM0030');

  })
  const updateWeatherData2 = nodeSchedule.scheduleJob(updateWeatherDataTask2,async ()=>{
    await updateWeatherData()
    console.log('updateWeatherAM0630');

  })
  const updateWeatherData3 = nodeSchedule.scheduleJob(updateWeatherDataTask3,async ()=>{
    await updateWeatherData()
    console.log('updateWeatherPM1230');
  })
  const updateWeatherData4 = nodeSchedule.scheduleJob(updateWeatherDataTask4,async ()=>{
    await updateWeatherData()
    console.log('updateWeatherPM1830');

  })
}

module.exports = setSchedule;