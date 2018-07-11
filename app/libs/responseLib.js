let generateResponse=(err, message, status, data)=>{
   let apiResponse={
       error:err,
       message:message,
       status:status,
       data:data

   }
   return apiResponse;
 
}

module.exports = {
    generateResponse: generateResponse
  }
  

