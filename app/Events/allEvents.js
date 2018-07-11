// calling the module 
var express = require('express');
const mongoose = require('mongoose');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const shortid = require('shortid');
/* Models */
// const meetingModel = mongoose.model('Meeting');
const meetingModel = mongoose.model('MeetingModel');
const UserModel = mongoose.model('User')

//creating an instance 
var app = express();

// we have to include events module - core nodejs 
var events = require('events');

// you have create an instance of event emitter
var eventEmitter = new events.EventEmitter();

//for sending mails
var nodemailer = require('nodemailer');


//method to save items list in our database
eventEmitter.on('save-meeting',meetingDetails=>{
    console.log('save-meeting');
    let newMeeting=new meetingModel({
         meetingId:meetingDetails.meetingId,
         meetingCreatorId:meetingDetails.meetingCreatorId,
         meetingCreatorName:meetingDetails.meetingCreatorName,
         title:meetingDetails.title,
         start:meetingDetails.start,
         end:meetingDetails.end,
         venueName:meetingDetails.venueName,
         meetingPurpose:meetingDetails.meetingPurpose,
         meetingPartner:meetingDetails.meetingPartner,
         meetingPartnerId:meetingDetails.meetingPartnerId
  
    });

    newMeeting.save((err,newMeeting)=>{
        if (err) {
            console.log(err)
            logger.error(err.message, 'save-meeting event: meeting-save', 10)
           
        } else {
            logger.info('Meeting saved', 'save-meeting event: meeting-save', 10)
            
        }

    })

});//end meeting save

//method to save items list in our database
eventEmitter.on('send-mail',meetingDetails=>{
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
               user: 'saknigam12@gmail.com',
               pass: 'sakanchal1295@'
           }
       });
   UserModel.findOne({userId:meetingDetails.meetingPartnerId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Events: send-mail', 10)
                
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'Events: send-mail',5)
                
            } else {
                

                meetingDetails.email=result.email;
                
                
            }
        });
   setTimeout(()=>{
    const mailOptions = {
        from: 'saknigam12@email.com', // sender address
        to: meetingDetails.email, // list of receivers
        subject: 'Hello '+ meetingDetails.meetingPartner+',', // Subject line
        html: "<p>A meeting called '"+meetingDetails.title+"' has been "+meetingDetails.operationName+"d.<br/>Go to your <a href='http://localhost:3005/login'>dashboard</a> to get more info.</p>"
       
       };
       console.log(mailOptions)
       transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err);
          logger.error('Sent Mail Failed!', 'Events: send-mail', 10)
          
          
        }
        else{
          console.log(info);
          logger.error('Mail Sent Successful!', 'Events: send-mail', 10)
            
        }
       });
    

   },2000)
   

});

//method to update meeting info
eventEmitter.on('save-update-meeting',meetingDetails=>{
    let updateQuery = {
        title:meetingDetails.title,
        start:meetingDetails.start,
        end:meetingDetails.end,
        venueName:meetingDetails.venueName,
        meetingPurpose:meetingDetails.meetingPurpose,
        modifiedOn:new Date()
      }
    meetingModel.update({ 'meetingId': meetingDetails.meetingId },updateQuery, {multi: true})
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'update Meeting event', 10)
           
        } else if (result.n == 0) {
            logger.info('No Meeting Found', 'update Meeting event',10)
           
        } else {
           logger.info('update Meeting','update Meetingevent',10);
        }
    });// end user model 

});//end

//method to delete meeting
eventEmitter.on('meeting-deletion',meetingDetails=>{
    meetingModel.remove({ 'meetingId': meetingDetails.meetingId })
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'delete meeting event', 10)
           
        } else if (result.n == 0) {
            logger.info('No Item Found', 'delete meeting event',10)
           
        } else {
           logger.info('Delete item','delete meeting event',10);
        }
    });// end user model find and remove

});//end

//method to remind about meeting
eventEmitter.on('remind-mail-normal',meetingDetails=>{
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
               user: 'saknigam12@gmail.com',
               pass: 'sakanchal1295@'
           }
       });
   UserModel.findOne({userId:meetingDetails.meetingPartnerId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Events: send-mail', 10)
                
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'Events: send-mail',5)
                
            } else {
                

                meetingDetails.email=result.email;
                
                
            }
        });
   setTimeout(()=>{
    const mailOptions = {
        from: 'saknigam12@email.com', // sender address
        to: meetingDetails.email, // list of receivers
        subject: 'Hello '+ meetingDetails.meetingPartner+',', // Subject line
        html: "<p>A meeting called '"+meetingDetails.title+"' is going to start soon, please make sure you are available.</p>"
       
       };
       console.log(mailOptions)
       transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err);
          logger.error('Sent Mail Failed!', 'Events: remind-mail-normal', 10)
          
          
        }
        else{
          console.log(info);
          logger.error('Mail Sent Successful!', 'Events: remind-mail-normal', 10)
            
        }
       });
    

   },2000)
   


});//end


//method to remind about meeting
eventEmitter.on('remind-mail-admin',meetingDetails=>{
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
               user: 'saknigam12@gmail.com',
               pass: 'sakanchal1295@'
           }
       });
   UserModel.findOne({userId:meetingDetails.meetingCreatorId})
        .select(' -__v -_id ')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Events: send-mail', 10)
                
            } else if (check.isEmpty(result)) {
                logger.info('No user Found', 'Events: send-mail',5)
                
            } else {
                

                meetingDetails.email=result.email;
                
                
            }
        });
   setTimeout(()=>{
    const mailOptions = {
        from: 'saknigam12@email.com', // sender address
        to: meetingDetails.email, // list of receivers
        subject: 'Hello '+ meetingDetails.meetingCreatorName+',', // Subject line
        html: "<p>A meeting called '"+meetingDetails.title+"' is going to start soon, please make sure you are available.</p>"
       
       };
       console.log(mailOptions)
       transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err);
          logger.error('Sent Mail Failed!', 'Events: remind-mail-admin', 10)
          
          
        }
        else{
          console.log(info);
          logger.error('Mail Sent Successful!', 'Events: remind-mail-admin', 10)
            
        }
       });
    

   },2000)
   


});//end

//method to update status to dismiss on remind
eventEmitter.on('remind-event-update-status',meetingDetails=>{
    let updateQuery;
    if(meetingDetails.user=="normal"){
         updateQuery = {
            statusNormal:"dismiss",
            modifiedOn:new Date()
          }

    }
    else{
         updateQuery = {
            statusAdmin:"dismiss",
            modifiedOn:new Date()
          }
    }
    console.log(updateQuery)

    meetingModel.update({ 'meetingId': meetingDetails.meetingId },updateQuery, {multi: true})
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'update status to dismiss event', 10)
           
        } else if (result.n == 0) {
            logger.info('No Meeting Found', 'update status to dismiss event',10)
           
        } else {
           logger.info('update Meeting','update status to dismiss event',10);
        }
    });// end user model 

});//end

//method to update mail sent to 1 on remind
eventEmitter.on('mail-remind-event-update-mailSent',meetingDetails=>{
    let updateQuery;
    if(meetingDetails.user=="normal"){
       updateQuery = {
        mailSentNormal:1,
        modifiedOn:new Date()
      }

    }
    else{
        updateQuery = {
            mailSentAdmin:1,
            modifiedOn:new Date()

    }
}
    meetingModel.update({ 'meetingId': meetingDetails.meetingId},updateQuery, {multi: true})
    .exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'update mail sent to 1  event', 10)
           
        } else if (result.n == 0) {
            logger.info('No Meeting Found', 'update mail sent to 1  event',10)
           
        } else {
           logger.info('update Meeting','update mail sent to 1  event',10);
        }
    });// end user model 

});//end


exports.emitter=eventEmitter;