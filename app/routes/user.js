const express = require('express');
const meetingApiConfig = require('../../config/MeetingApiConfig');
const userController = require("./../../app/controllers/userController");
const hash=require('../middlewares/hash');
const auth=require('../middlewares/Authorization');

const app = express();

module.exports.setRouter = (app) => {

    let baseUrl = `${meetingApiConfig.apiVersion}/users`;

    app.post(`${baseUrl}/signup`, hash.hash,userController.signUpFunction);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for Signup.
     *
     * @apiParam {string} userType Type of user(normal or admin). (body params) (required)
     * @apiParam {string} firstName First Name of the user. (body params) (required)
     * @apiParam {string} lastName  Last Name of the user. (body params) (required)
     * @apiParam {string} userName  UserName. (body params) (required)
     * @apiParam {string} email     Email of the user. (body params) (required)
     * @apiParam {string} password  Password of the user. (body params) (required)
     * @apiParam {string} mobileNumber  Mobile Number of the user. (body params) (required)
     * @apiParam {string} country  Country Code of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
        {
    "error": false,
    "message": "User created and Mail sent Successful!",
    "status": 200,
    "data": {
        "userId": "ByePDU6k7",
        "userType":2,
        "firstName": "Anchal",
        "lastName": "Nigam",
        "userName":"anchal-admin",
        "email": "anchalnigamm@gmail.com",
        "mobileNumber": "+91-9026224948",
        "country": "India",
        "hash": "o64ifdmrta9fba8q0ykhcp5sxwoogl3y5",
        "active": false,
        
        "_id": "5b0fd758e762fc09d4c61e02",
        "__v": 0
    }
}
}
    */
   
    app.put(`${baseUrl}/verifyEmail`, userController.verifyEmail);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/verifyEmail api for verifying Email.
     *
     * @apiParam {string} hash hash which is provided in email link. (body params) (required)
     * 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
          {
    "error": false,
    "message": "User Verified Successfully",
    "status": 200,
    "data": {
        
        "userId": "rkWlVp1RM",
        "userType":2,
        "firstName": "Anchal",
        "lastName": "Nigam",
        "userName":"anchal-admin",
        "email": "anchalnigamm@gmail.com",
        "mobileNumber": 9026224948,
        "hash": "8ug67ar1zoyrndloe73ztai17xa4jafi",
        "active": true,      
        "createdOn": "2018-05-09T00:42:17.000Z",
        "_id": "5af243e929485a1718f18c53",
        "__v": 0
    
        
    }
}
  
     @apiErrorExample {json} Error-Response:
    *
    * {
    "error": true,
    "message": "Hash is missing",
    "status": 403,
    "data": null
}
{
    "error": true,
    "message": "User Not found",
    "status": 404,
    "data": null
}
    */


   
    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} userType Type of user(normal or admin). (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
         {
    "error": false,
    "message": "Login Successful",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd2lkIjoiSHlyVk9vVEpRIiwiaWF0IjoxNTI3Nzg1NTE2NzY2LCJleHAiOjE1Mjc4NzE5MTYsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6ImVkd2lzb3JQcm9qZWN0IiwiZGF0YSI6eyJ1c2VySWQiOiJyMWZOdTg2eW0iLCJmaXJzdE5hbWUiOiJBbmNoYWwiLCJsYXN0TmFtZSI6Ik5pZ2FtIiwiZW1haWwiOiJhbmNoYWxuaWdhbW1AZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjoiIDkxLTkwMjYyMjQ5NDgiLCJjb3VudHJ5IjoiSU4ifX0.ieG6fhHifSS4f2j5Li46lzjNlAsyFpoZow2GYeYyVKc",
        "userDetails": {
            "userId": "r1fNu86ym",
            "userType":2,
            "firstName": "Anchal",
            "lastName": "Nigam",
            "userName":"anchal-admin",
            "email": "anchalnigamm@gmail.com",
            "mobileNumber": " 91-9026224948",
            "country": "IN"
        }
    }
}
  
     @apiErrorExample {json} Error-Response:
    *
    * {
    "error": true,
    "message": "User has not Verified!",
    "status": 400,
    "data": null
}
{
    "error": true,
    "message": "Wrong Password!Login Failed",
    "status": 400,
    "data": null
}
    */

    
    app.post(`${baseUrl}/forgotPassword`,userController.forgotPassword);
    
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/forgotPassword api for sending mail for password change.
     *
     * @apiParam {string} email Email of the user. (body params) (required)
     * 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
          {
    "error": false,
    "message": "Mail Sent Successful!",
    "status": 200,
    "data": null
}
  
     @apiErrorExample {json} Error-Response:
    *
    * {
    "error": true,
    "message": "Server Error!Sent Mail Failed.",
    "status": 500,
    "data": null
}

    */

    app.put(`${baseUrl}/resetPassword`,userController.resetPassword);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/resetPassword api for resetting password.
     *
     * @apiParam {string} email Email of the user which is provided at email link by encrypting using btoa. (body params) (required)
     *  @apiParam {string} password password of the user. (body params) (required)
     * 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
        {
    "error": false,
    "message": "Password changed successfully!",
    "status": 200,
    "data": {
        "userId": "r1fNu86ym",
        "userType":2,
        "firstName": "Anchal",
        "lastName": "Nigam",
        "userName":"anchal-admin",
        "password": "$2a$10$Zs/9yOheKp..6LIZbEOi8ePxmVfdoxhGvPxFwcovFW5KhTJ2IT.Lq",
        "email": "anchalnigamm@gmail.com",
        "mobileNumber": " 91-9026224948",
        "country": "IN",
        "hash": "jrw74tgx28ex1wat5vq4wjr57ehe8w1qh",
        "active": true,
        "createdOn": null,
        "_id": "5b0fd82ae762fc09d4c61e03",
        "__v": 0
    }
}
     @apiErrorExample {json} Error-Response:
    *
    * {
    "error": true,
    "message": "One or more parameter is missing",
    "status": 403,
    "data": null
}
{
    "error": true,
    "message": "Error Occured!",
    "status": 500,
    "data": null
}

    */

   
   app.get(`${baseUrl}/view/all/normal`, auth.isAuthorized,userController.getAllNormalUser);
   /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/view/all api for getting all users.
     
     * @apiParam {string} authToken Authorization Token of user. (query params) (required)
    
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
     * {
    "error": false,
    "message": "All User Details Found",
    "status": 200,
    "data": [
       
            {
            "userId": "BJWMMHPGm",
            "userType": 1,
            "firstName": "Sunita",
            "lastName": "Nigam",
            "userName": "Sunita12",
            "email": "ibm2013044@iiita.ac.in",
            "mobileNumber": " 91-9026224948",
            "country": "IN"
        },
        
       
    ]
}
      
 @apiErrorExample {json} Error-Response:
    *
    {
    "error": true,
    "message": "Invalid Or Expired AuthorizationKey",
    "status": 404,
    "data": null
}
{
    "error": true,
    "message": "No User Found",
    "status": 404,
    "data": null
}
    */


    //This is all for checking purpose
   app.get(`${baseUrl}/view/all`, userController.getAllUser);
   app.put(`${baseUrl}/:userId/edit`, userController.editUser);

   app.post(`${baseUrl}/:userId/delete`, userController.deleteUser);
//end 

   app.post(`${baseUrl}/logout`, userController.logout);
 /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout api to logout user.
     *
     * @apiParam {string} authToken Auth Token of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
        @apiErrorExample {json} Error-Response:
    *
    * {
    "error": true,
    "message": "Already Logged Out or Invalid UserId",
    "status": 404,
    "data": null
}
{
    "error": true,
    "message": "Error Occured!",
    "status": 500,
    "data": null
}
    */


}//end

