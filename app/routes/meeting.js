const express = require('express');
const meetingApiConfig = require('../../config/MeetingApiConfig');
const meetingController = require("./../../app/controllers/meetingController");
const auth=require('../middlewares/Authorization');

const app = express();

module.exports.setRouter = (app) => {

    let baseUrl = `${meetingApiConfig.apiVersion}/meetings`;

    app.get(`${baseUrl}/:userId/view/all`, auth.isAuthorized,meetingController.getAllMeetings);
     /**
     * @apiGroup Meetings
     * @apiVersion  1.0.0
     * @api {get} /api/v1/meetings/:userId/view/all api for getting all meetings of a user.
     
     * @apiParam {string} authToken Authorization Token of user. (query params) (required)
     * @apiParam {string} userId    Id of user. (url params) (required)
    
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
     {
    "error": false,
    "message": "All Meeting Details Found",
    "status": 200,
    "data": [
        {
            "meetingId": "H1EMNHJ7Q",
            "meetingCreatorId": "BkvIGrvfQ",
            "meetingCreatorName": "Anchal Nigam",
            "title": "Project discussion",
            "start": "2018-07-08T08:09:38.797Z",
            "end": "2018-07-08T08:57:52.780Z",
            "venueName": "Near Station",
            "meetingPurpose": "For discussing",
            "meetingPartner": "Sunita Nigam",
            "meetingPartnerId": "BJWMMHPGm",
            "statusNormal": "dismiss",
            "statusAdmin": "dismiss",
            "mailSentNormal": 1,
            "mailSentAdmin": 1,
            "createdOn": "2018-07-08T07:56:30.555Z",
            "modifiedOn": "2018-07-08T08:06:33.788Z"
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
    "message": "No Meeting Found",
    "status": 404,
    "data": null
}
    */

    app.get(`${baseUrl}/admin/:adminId/view/all`, auth.isAuthorized,meetingController.getAllAdminMeetings);

    /**
     * @apiGroup Meetings
     * @apiVersion  1.0.0
     * @api {get} /api/v1/meetings/admin/:adminId/view/all api for getting all meetings of a admin.
     
     * @apiParam {string} authToken Authorization Token of user. (query params) (required)
     * @apiParam {string} adminId    Id of admin. (url params) (required)
    
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
     {
    "error": false,
    "message": "All Meeting Details Found",
    "status": 200,
    "data": [
        {
            "meetingId": "H1EMNHJ7Q",
            "meetingCreatorId": "BkvIGrvfQ",
            "meetingCreatorName": "Anchal Nigam",
            "title": "Project discussion",
            "start": "2018-07-08T08:09:38.797Z",
            "end": "2018-07-08T08:57:52.780Z",
            "venueName": "Near Station",
            "meetingPurpose": "For discussing",
            "meetingPartner": "Sunita Nigam",
            "meetingPartnerId": "BJWMMHPGm",
            "statusNormal": "dismiss",
            "statusAdmin": "dismiss",
            "mailSentNormal": 1,
            "mailSentAdmin": 1,
            "createdOn": "2018-07-08T07:56:30.555Z",
            "modifiedOn": "2018-07-08T08:06:33.788Z"
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
    "message": "No Meeting Found",
    "status": 404,
    "data": null
}
    */
    app.get(`${baseUrl}/:meetingId/view/single`, auth.isAuthorized,meetingController.getAMeetingDetail);
/**
     * @apiGroup Meetings
     * @apiVersion  1.0.0
     * @api {get} /api/v1/meetings/:meetingId/view/single api for getting single meeting information.
     
     * @apiParam {string} authToken Authorization Token of user. (query params) (required)
     * @apiParam {string} meetingId    Id of meeting. (url params) (required)
    
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {json} Success-Response:
     {
    "error": false,
    "message": "All Meeting Details Found",
    "status": 200,
    "data": {
        "meetingId": "H1EMNHJ7Q",
        "meetingCreatorId": "BkvIGrvfQ",
        "meetingCreatorName": "Anchal Nigam",
        "title": "Project discussion",
        "start": "2018-07-08T08:09:38.797Z",
        "end": "2018-07-08T08:57:52.780Z",
        "venueName": "Near Station",
        "meetingPurpose": "For discussing",
        "meetingPartner": "Sunita Nigam",
        "meetingPartnerId": "BJWMMHPGm",
        "statusNormal": "dismiss",
        "statusAdmin": "dismiss",
        "mailSentNormal": 1,
        "mailSentAdmin": 1,
        "createdOn": "2018-07-08T07:56:30.555Z",
        "modifiedOn": "2018-07-08T08:06:33.788Z"
    }
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
    "message": "No Meeting Found",
    "status": 404,
    "data": null
}
    */



};