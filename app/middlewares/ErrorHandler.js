const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');

let globalHandler=(err,req,res,next)=>{
     logger.error('Application level error handler','Initial stage',10);
     console.log(err)
     let apiResponse=response.generateResponse(true,"Some error occured at global level",500,null);
     res.send(apiResponse);
}//end

//method of not found route
let notFoundHandler=(req,res,next)=>{
    logger.error('Route Not Found','Router level',10);
    let apiResponse=response.generateResponse(true,"Route not found in the application",404,null);
    res.send(apiResponse);
  

}//end


module.exports = {
    globalErrorHandler : globalHandler,
    globalNotFoundHandler : notFoundHandler
}


