const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
//for sending mails
var nodemailer = require('nodemailer');
/* Models */

const meetingModel = mongoose.model('MeetingModel');

/* Get all meetings of particular user  */
let getAllMeetings= (req, res) => {
    if (check.isEmpty(req.params.userId)) {

        console.log('User Id should be passed')
        let apiResponse = response.generateResponse(true, 'User Id is missing', 403, null)
        res.send(apiResponse)
    }
    else{
        meetingModel.find({meetingPartnerId:req.params.userId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Meeting Controller: getAllMeetings', 10)
                let apiResponse = response.generateResponse(true, 'Failed To Find Meeting Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Meeting Found', 'Meeting Controller: getAllMeetings',5)
                let apiResponse = response.generateResponse(true, 'No Meeting Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generateResponse(false, 'All Meeting Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }
    


}//end get all meetings

/* Get all meetings of particular admina */
let getAllAdminMeetings= (req, res) => {
    if (check.isEmpty(req.params.adminId)) {

        console.log('Admin Id should be passed')
        let apiResponse = response.generateResponse(true, 'Admin Id is missing', 403, null)
        res.send(apiResponse)
    }
    else{
        meetingModel.find({meetingCreatorId:req.params.adminId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Meeting Controller: getAllAdminMeetings', 10)
                let apiResponse = response.generateResponse(true, 'Failed To Find Meeting Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Meeting Found', 'Meeting Controller: getAllAdminMeetings',5)
                let apiResponse = response.generateResponse(true, 'No Meeting Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generateResponse(false, 'All Meeting Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }
    


}//end get all admin meetings

// Get a single meeting detail  */
let getAMeetingDetail= (req, res) => {
    if (check.isEmpty(req.params.meetingId)) {

        console.log('Meeting Id should be passed')
        let apiResponse = response.generateResponse(true, 'Meeting Id is missing', 403, null)
        res.send(apiResponse)
    }
    else{
        meetingModel.findOne({meetingId:req.params.meetingId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Meeting Controller: getAMeetingDetail', 10)
                let apiResponse = response.generateResponse(true, 'Failed To Find Meeting Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Meeting Found', 'Meeting Controller: getAMeetingDetail',5)
                let apiResponse = response.generateResponse(true, 'No Meeting Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generateResponse(false, 'All Meeting Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }
    


}//end get single meeting detail

module.exports = {

  getAllMeetings:getAllMeetings,
  getAMeetingDetail:getAMeetingDetail,
  getAllAdminMeetings:getAllAdminMeetings
}