const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const secretKey = 'BuildingMyApiForEdwisorProjectHappyAnchal';


let generateToken = (data, cb) => {
    try {
        let claim = {
            jwid: shortid.generate(),
            iat: Date.now(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            sub: 'authToken',
            iss: 'edwisorProject',
            data: data
        }

    let tokenDetails={
        token:jwt.sign(claim,secretKey),
        tokenSecret:secretKey
    }
    cb(null,tokenDetails);

    }
    catch(err){
    console.log(err)
    cb(err, null)

    }
}
//end
let verifyClaim = (token,secretKey,cb) => {
    // verify a token symmetric
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err){
        console.log("error while verify token");
        console.log(err);
        cb(err,null)
      }
      else{
        console.log("user verified");
        
        cb(null,decoded);
      }  
   
   
    });

}//end

let verifyClaimWithoutSecret = (token,cb) => {
    // verify a token symmetric
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err){
        console.log("error while verify token");
        console.log(err);
        cb(err,null)
      }
      else{
        console.log("user verified");
        cb (null,decoded)
      }  
   
   
    });
  
  
  }// end verify claim 
  

module.exports = {
    generateToken: generateToken,
    verifyClaim:verifyClaim,
    verifyClaimWithoutSecret : verifyClaimWithoutSecret
}