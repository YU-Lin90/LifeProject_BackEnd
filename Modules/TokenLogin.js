const express = require("express");
const router = express.Router();
const DB = require("../Modules/ConnectDataBase");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
//const hashedPass= await bcrypt.hash('123456',10)
//const bools = await bcrypt.compare('123456',password)
// SELECT `sid`, `account`, `email`, `password`, `regist_time`, `set_language` FROM `member` WHERE 1

//登入
router.post("/login", async (req, res) => {
  const output = {
    errorType: "",
    success: false,
    token: null,
  };
  
  const datas = req.body;
  const email = datas.email.trim();
  const password = datas.password.trim();
  if (!email || !password) {
    output.errorType = "textError";
    return res.json(output);
  }
  const loginSql =
    "SELECT `sid`, `name`, `email`, `password`,`set_language` FROM `member` WHERE `email` LIKE ? ";
  try {
    const  [[result]] = await DB.query(loginSql,email);
    if (!result) {
      output.errorType = "textError";
      return res.json(output);
    }
    //密碼比對檢查
    const passStat = await bcrypt.compare(password, result.password);
    if (!passStat) {
      output.errorType = "textError";
      return res.json(output);
    } else {
      output.success = true;
      const signToken = jwt.sign({
        sid: result.sid, email: result.email, name: result.name
      }, process.env.JWT_SECRET);
      output.lang = result.set_language
      output.token = signToken;
      output.name = result.name
      output.sid = String(result.sid);
      return res.json(output);
    }
  } catch (error) {
    output.errorType='ServerError'
    return res.json(output);
  }

});

//進入頁面的登入檢查
router.get("/loginCheck", async (req, res) => {
  const output = {
    success:false,
    errorType:''
  }
  let parsedToken = null;
  if(!req.header('Authorization')){
    output.errorType='NoToken'
    return res.json(output);
  }
  const tokenGet = req.header('Authorization').replace('Bearer ', '')
  //因為進來的時候會加Bearer 所以NULL會變文字
  if(tokenGet==="null"){
    //沒傳東西直接擋掉
    output.errorType='DisableToken'
    return res.json(output);
  }
  else {
    //先轉換再放回全域變數
    try {
      parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    } catch (error) {
      output.errorType='DisableToken'
      return res.json(output);
    }
  }
  const loginSql = "SELECT `sid`, `name`, `email`,`set_language` FROM `member` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
  const {email,sid,name} = parsedToken
  try {
    const [[result]] = await DB.query(loginSql, [email,name,sid]);
    if(!result){
      return res.json(output);
    }
    else{
      output.lang = result.set_language
      output.success=true
      output.name = name
      return res.json(output);
    }
  } catch (error) {
    output.errorType='ServerError'
    return res.json(output);
  }

})

module.exports = router;