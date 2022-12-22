const jwt = require("jsonwebtoken");
const DB = require("./ConnectDataBase");
//這邊只有檢查 
const memberTokenLoginCheck = async (req, res, next) => {
  const output = {
    success: false,
    errorType: "",
  };
  let parsedToken = null;
  if (!req.header("Authorization")) {
    output.errorType = "NoToken";
    return res.json(output);
  }
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  //因為進來的時候會加Bearer 所以NULL會變文字
  if (tokenGet === "null") {
    //沒傳東西直接擋掉
    output.errorType = "DisableToken";
    return res.json(output);
  } else {
    //先轉換再放回全域變數
    try {
      parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    } catch (error) {
      output.errorType = "DisableToken";
      return res.json(output);
    }
  }
  const loginSql =
    "SELECT `sid`, `name`, `email`,`is_locked` FROM `member` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
  const { email, sid, name } = parsedToken;
  try {
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(output);
    } else if (result.is_locked === 1) {
      output.errorType = "AccountLocked";
      return res.json(output);
    } else {
      req.token = parsedToken;
      next();
    }
  } catch (error) {
    output.errorType = "ServerError";
    return res.json(output);
  }
};

module.exports = memberTokenLoginCheck;
