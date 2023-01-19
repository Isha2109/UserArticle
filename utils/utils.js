const crypto = require("crypto");
const cuid = require('cuid');

 function getUserId(){
    var reqId = crypto.randomBytes(8).toString("hex");
    return reqId
 }

  function getArticleId(){
    var id = cuid.slug();
    return id;
  }

 module.exports= {
   getUserId, getArticleId
}