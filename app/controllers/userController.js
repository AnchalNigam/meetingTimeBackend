const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const validateInput = require('../libs/validateParams');
const passwordLib = require('../libs/passwordLib');
const token = require('../libs/tokenLib')

var btoa = require('btoa');
//for sending mails
var nodemailer = require('nodemailer');
/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')


//Signup function
let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {

            if (!check.isEmpty(req.body.email) && !check.isEmpty(req.body.firstName) && !check.isEmpty(req.body.lastName)
                && !check.isEmpty(req.body.mobileNumber) && !check.isEmpty(req.body.password) 
                && !check.isEmpty(req.body.country) && !check.isEmpty(req.body.userType)
               && !check.isEmpty(req.body.userName)) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generateResponse(true, 'Email Does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (!validateInput.Password(req.body.password)) {
                    let apiResponse = response.generateResponse(true, 'Password Does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (!validateInput.FirstName(req.body.firstName)) {
                    let apiResponse = response.generateResponse(true, 'First Name Does not meet the requirement', 400, null)
                    reject(apiResponse)
                }
                else if (!validateInput.LastName(req.body.lastName)) {
                    let apiResponse = response.generateResponse(true, 'Last Name Does not meet the requirement', 400, null)
                    reject(apiResponse)
                }
                else if (!validateInput.mobileNumber(req.body.mobileNumber)) {
                
                    let apiResponse = response.generateResponse(true, 'Mobile Number Does not meet the requirement', 400, null)
                    reject(apiResponse)
                }
                else if (!validateInput.userName(req.body.userName)) {
                
                    let apiResponse = response.generateResponse(true, 'User Name Does not meet the requirement', 400, null)
                    reject(apiResponse)
                }


                else {
                    console.log('yes')
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generateResponse(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input

    let createUser = () => {
        return new Promise((resolve, reject) => {
            let email = req.body.email.toLowerCase();
            UserModel.findOne({ email: email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {

                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generateResponse(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {


                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            userType:req.body.userType,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            userName:req.body.userName,
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            country: req.body.country,
                            password: passwordLib.hashpassword(req.body.password),
                            hash: req.hash
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generateResponse(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        console.log(retrievedUserDetails);
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generateResponse(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function

    let sendMail = (newUserObj) => {
        return new Promise((resolve, reject) => {
            let data={
                "email":req.body.email,
                "hash":req.hash,
                "name":`${req.body.firstName} ${req.body.lastName}`
            };
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'saknigam12@gmail.com',
                    pass: 'sakanchal1295@'
                }
            });

            const mailOptions = {
                from: 'saknigam12@email.com', // sender address
                to: data.email, // list of receivers
                subject: 'Please confirm your Email account', // Subject line
                text: `Hi! ${data.name},
                Please Click on the link to verify your email.`,// plain text body
                html:'<a href="http://meetingtime.webdeveloperjourney.xyz/verify/'+data.hash+'">http://localhost:4200/'+data.hash+'</a>'
               };
               console.log(mailOptions)
               transporter.sendMail(mailOptions, function (err, info) {
           
                if (err) {
                    console.log(err);
                    logger.error('Sent Mail Failed!', 'User Controller: createUser', 10)
                    let apiResponse = response.generateResponse(true, 'Server Error!Sent Mail Failed.', 500, null)
                    reject(apiResponse)


                }
                else {
                    console.log(info);
                    logger.error('Mail Sent Successful!', 'User Controller: createUser', 10)

                    resolve(newUserObj)
                }
            });


        });

    }//end

    validateUserInput()
        .then(createUser)
        .then(sendMail)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generateResponse(false, 'User created and Mail sent Successful!', 200, resolve)
            res.send(apiResponse)

        })
        .catch((err) => {
            res.send(err)

        })


}//end

//verify email function
let verifyEmail=(req,res)=>{
    if (check.isEmpty(req.body.hash)) {

        console.log('Hash should be passed')
        let apiResponse = response.generateResponse(true, 'Hash is missing', 403, null)
        res.send(apiResponse)
    }
    else{
        let hash = { $set: { active: true } };;
        UserModel.update({ 'hash': req.body.hash },hash, { multi: true })
        .exec((err, result) => {
            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generateResponse(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('User Not Found.')
                logger.error('User Not Found', 'userController: verifyEmail', 10)
                let apiResponse = response.generateResponse(true, 'User Not found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('User Verified Successfully')
                logger.error('User Verified Successfully!', 'userController: verifyEmail', 10)
                let apiResponse = response.generateResponse(false, 'User Verified Successfully.', 200, result)
                res.send(apiResponse)
            }

        });

    }
}
//end verify email

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email && req.body.userType) {
                console.log("req body email is there");
                
                let email=req.body.email.toLowerCase();
                let userType=req.body.userType;
                UserModel.findOne({ email: email,userType:userType})
                .exec((err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                       
                        let apiResponse = response.generateResponse(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                       
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generateResponse(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generateResponse(true, 'parameters are missing', 400, null)
                reject(apiResponse)
            }
        });
    }   //find user end

    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            if (req.body.password) {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generateResponse(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    
                    console.log(retrievedUserDetailsObj);
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete  retrievedUserDetailsObj.hash
                    

                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generateResponse(true, 'Wrong Password!Login Failed', 400, null)
                    reject(apiResponse)
                }
            });
        }//end if statement
        else{
            let apiResponse = response.generateResponse(true, 'Password parameter is missing', 400, null)
             reject(apiResponse)
        }
        });
    } //end validate password

    //METHOD TO CHECK whether the user verify himself by link provided in email
    let checkStatus=(retrievedUserDetails)=>{
       return new Promise((resolve, reject) => {
          if(retrievedUserDetails.active==false){
            let apiResponse = response.generateResponse(true, 'User has not Verified!', 400, null)
            reject(apiResponse);
          }
          else{
              delete retrievedUserDetails.active;
              resolve(retrievedUserDetails);
          }

       });
    }//end 

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generateResponse(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    
                    resolve(tokenDetails)
                }
            })
        })
    }//end generate token

    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generateResponse(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: Date.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generateResponse(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = Date.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generateResponse(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }  //save token end

    findUser()
    .then(validatePassword)
    .then(checkStatus)
    .then(generateToken)
    .then(saveToken)
    .then((resolve) => {
        let apiResponse = response.generateResponse(false, 'Login Successful', 200, resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        
        res.send(err)
    });
}//end of login funtion
    
//forgot password function
let forgotPassword=(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
               user: 'saknigam12@gmail.com',
               pass: 'sakanchal1295@'
           }
       });
     
   let secretKey="mychoiceypassword";
   let emailEncrypt=btoa(req.body.email+secretKey);
   const mailOptions = {
    from: 'saknigam12@email.com', // sender address
    to: req.body.email, // list of receivers
    subject: 'Reset your password', // Subject line
    html: "<p>Hi!,<br/>Please <a href='http://meetingtime.webdeveloperjourney.xyz/reset/"+emailEncrypt+"'>Click here</a> to change your password!</p>"
   
   };
   console.log(mailOptions)
   transporter.sendMail(mailOptions, function (err, info) {
    if(err){
      console.log(err);
      logger.error('Sent Mail Failed!', 'User Controller: forgotPassword', 10)
      let apiResponse = response.generateResponse(true, 'Server Error!Sent Mail Failed.', 500, null)
      res.send(apiResponse)

      
    }
    else{
      console.log(info);
      logger.error('Mail Sent Successful!', 'User Controller: forgotPassword', 10)
        let apiResponse = response.generateResponse(false, 'Mail Sent Successful!', 200, null)
        res.send(apiResponse)
    }
   });


}
//end forgotpassword


//reset passsword
let resetPassword=(req,res)=>{
    let emailCheck=()=>{
        return new Promise((resolve, reject) => {
    if (check.isEmpty(req.body.email) || (check.isEmpty(req.body.password))) {

        console.log('Parameters should be passed')
        let apiResponse = response.generateResponse(true, 'One or more parameter is missing', 403, null)
        reject(apiResponse)
    }
    else{
        UserModel.findOne({ 'email': req.body.email })
        .exec((err,result)=>{
            if(err){
                console.log(err)
                logger.error(err.message, 'User Controller: resetPassword', 10)
                let apiResponse=response.generateResponse(true,"Error Occured!",500,null);
                reject(apiResponse)
            }
            else if (check.isEmpty(result)) {
                console.log('Email does not exist!')
                logger.info('Email does not exist!', 'user Controller: resetPssword',5)
                let apiResponse=response.generateResponse(true,"Email does not exist!",404,null);
                reject(apiResponse)
               
            }
            else{
                resolve(result);
                
            }


        });
    }//else statement
});
    }//emailcheck function 
    
let changePassword=(userDetails)=>{
    return new Promise((resolve, reject) => {
         userDetails.password=passwordLib.hashpassword(req.body.password);
         userDetails.save((error,resul)=>{
            if (error) {
                console.log(error)
                logger.error(err.message, 'User Controller: resetPassword', 10)
                let apiResponse=response.generateResponse(true,"Error Occured!",500,null);
                reject(apiResponse)
            }
            else {
                console.log("Password changed successfully")
                logger.info('Password changed Successfully!', 'User Controller: resetPssword',5)
                let apiResponse=response.generateResponse(false,"Password changed successfully!",200,resul);
                resolve(apiResponse)

            }
        });

    });
}//end change password

emailCheck()
.then(changePassword)
.then((resolve) => {
    delete resolve.password

    res.send(resolve)
})
.catch((err) => {
    console.log(err);
    res.send(err);
})


}//end reset password


/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select('-password  -__v -_id -createdOn -active -hash')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generateResponse(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser',5)
                let apiResponse = response.generateResponse(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generateResponse(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })


}//end get all user function

/* Get all normaluser Details */
let getAllNormalUser = (req, res) => {
    UserModel.find({userType:1})
        .select('-password  -__v -_id -createdOn -active -hash')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generateResponse(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser',5)
                let apiResponse = response.generateResponse(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generateResponse(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })


}//end get all user function

let editUser = (req, res) => {
    if (check.isEmpty(req.params.userId)) {

        console.log('User Id should be passed')
        let apiResponse = response.generateResponse(true, 'User Id is missing', 403, null)
        res.send(apiResponse)
    }
    else {
        let options = req.body;
        UserModel.findOne({ 'userId': req.params.userId })
            .exec((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller: editUser', 10)
                    let apiResponse = response.generateResponse(true, "Error Occured!", 500, null);
                    res.send(apiResponse)
                }
                else if (check.isEmpty(result)) {
                    console.log('No user Found')
                    logger.info('No user Found', 'user Controller: editUser', 5)
                    let apiResponse = response.generateResponse(true, "No user Found!", 404, null);
                    res.send(apiResponse)

                }
                else {
                    for (let i in options) {
                        result[i] = options[i];
                    }
                    result.save((error, resul) => {
                        if (error) {
                            console.log(error)
                            logger.error(err.message, 'User Controller: editUser', 10)
                            let apiResponse = response.generateResponse(true, "Error Occured!", 500, null);
                            res.send(apiResponse)
                        }
                        else {
                            console.log("User Details updated successfully")
                            logger.info('User Details Update Successfully!', 'User Controller: editUser', 5)
                            let apiResponse = response.generateResponse(false, "User Details Updated successfully!", 200, resul);
                            res.send(apiResponse)

                        }
                    });
                }

            });
    }
}//edit functionn end

//Delete user
let deleteUser = (req, res) => {
    if (check.isEmpty(req.params.userId)) {

        console.log('UserId should be passed')
        let apiResponse = response.generateResponse(true, 'userId is missing', 403, null)
        res.send(apiResponse)
    }
    else {
        UserModel.remove({ 'userId': req.params.userId })
            .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'User Controller: deleteUser', 10)
                    let apiResponse = response.generateResponse(true, 'Failed To delete user', 500, null)
                    res.send(apiResponse)
                } else if (result.n == 0) {
                    logger.info('No User Found', 'User Controller: deleteUser',10)
                    let apiResponse = response.generateResponse(true, 'No User Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generateResponse(false, 'Deleted the user successfully', 200, null)
                    res.send(apiResponse)
                }
            });// end user model find and remove

    }
}//end delete function

let logout = (req, res) => {
console.log(req.query.authToken);
    AuthModel.remove({authToken: req.query.authToken}, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generateResponse(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('empty', 'user Controller: logout', 10)
            let apiResponse = response.generateResponse(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            logger.info('no', 'user Controller: logout', 10)
            let apiResponse = response.generateResponse(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
      })
  
} // end of the logout function.

module.exports = {
    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    getAllNormalUser:getAllNormalUser,
    verifyEmail:verifyEmail,
    forgotPassword:forgotPassword,
    resetPassword:resetPassword,
    loginFunction:loginFunction,
    editUser: editUser,
    deleteUser: deleteUser,
    logout:logout
}