const DB = require("../ConnectDataBase");
const moment = require("moment-timezone");
const nodeSchedule  = require('node-schedule')

const updateTaskam6 = '* 1 6 * * *'
const updateTaskpm0 = '* 1 12 * * *'
const updateTaskpm6 = '* 1 18 * * *'
//天氣資料更新預報排程
//https://ithelp.ithome.com.tw/articles/10243928

const setSchedule = async ()=>{
  const testTask = '5 * * * * *'
  const testJob = nodeSchedule.scheduleJob(testTask,()=>{
    console.log('test' + new Date());
  })
}

module.exports = setSchedule;