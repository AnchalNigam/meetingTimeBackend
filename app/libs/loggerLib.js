const logger=require('pino')();
const moment=require('moment');

//This is for loggin error messages
let captureError=(errorMessage,errorSource,errorLevel)=>{
 let currentTime=moment();
 
 let errorResponse={
     'currentTime': currentTime,
     'errorMessage':errorMessage,
     'errorSource':errorSource,
     'errorLevel':errorLevel,
     
 }//end

 logger.error(errorResponse);
 return errorResponse;
}//end method

//This is for loggin error messages
let captureInfo=(message,source,level)=>{
    let currentTime=moment();
    
    let Response={
        'currentTime': currentTime,
        'successMessage':message,
        'successSource':source,
        'successLevel':level,
        
    }//end
   
    logger.error(Response);
    return Response;
   }//end method

   //export of 
   module.exports = {
    error: captureError,
    info: captureInfo
  }
  