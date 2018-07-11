//first name should contain only letters and start with capital and of minimum 2 characters
let FirstName=(firstName)=>{
   let firstNameRegex=/^[A-Z][A-za-z ]{1,}$/  ;
   if(firstName.match(firstNameRegex)) {
       return firstName;
   }  
   else{
       return false;
   }
}//end

//last name should contain only letters and start with capital and of minimum 2 characters
let LastName=(lastName)=>{
    let lastNameRegex=/^[A-Z][A-za-z ]{1,}$/  ;
    if(lastName.match(lastNameRegex)) {
        return lastName;
    }  
    else{
        return false;
    }
 }//end
 
 //user name should contain only letter,characters,hyphen and start with capital and of minimum 2 characters
let userName=(userName)=>{
  let userNameRegex=/^[A-Z][A-za-z0-9- ]{1,}$/  ;
  if(userName.match(userNameRegex)) {
      return userName;
  }  
  else{
      return false;
  }
}//end



let Email = (email) => {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(emailRegex)) {
      return email
    } else {
      return false
    }
  }
  
    /* Minimum 8 characters which contain only characters,numeric digits, underscore and first character must be a letter */
  let Password = (password) => {
    let passwordRegex = /^[A-Z]\w{7,}$/
    if (password.match(passwordRegex)) {
      return password
    } else {
      return false
    }
  }
  
  //Mobile number should contain 10 digits
let mobileNumber=(mobile)=>{
  let mob=mobile.indexOf('-');
  mob=mobile.slice(mob+1);
  console.log(mob);
    let mobileRegex=/^\d{10}$/  ;
    if(mob.match(mobileRegex)) {
      console.log('mobile number right')
        return mobile;
    }  
    else{
        return false;
    }
 }//end
 
  module.exports = {
    Email: Email,
    Password: Password,
    FirstName:FirstName,
    LastName:LastName,
    userName:userName,
    mobileNumber:mobileNumber
  }
  