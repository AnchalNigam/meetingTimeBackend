let trim=(x)=>{
  let value=String(x);
  return value.replace(/^\s+|\s+$/gi,'');
}//end

let isEmpty=(value)=>{
   if(value===null || value===undefined || value.length===0 || trim(value)===''){
       return true
   }
   else{
       return false;
   }

}//end

module.exports={
    isEmpty:isEmpty
}