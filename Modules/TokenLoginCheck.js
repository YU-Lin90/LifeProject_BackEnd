const jwt = require("jsonwebtoken");
const DB = require("./ConnectDataBase");

const memberTokenLoginCheck = async(req,res,next) =>{
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
      req.token=parsedToken
      next();      
    }
  } catch (error) {
    output.errorType='ServerError'
    return res.json(output);
  }
}

module.exports = memberTokenLoginCheck;