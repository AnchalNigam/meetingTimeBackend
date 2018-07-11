'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let meetingSchema = new Schema({
  meetingId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  meetingCreatorId:{
    type: String,
    default: '',
  },
  meetingCreatorName:{
    type: String,
    default: '',
  },
  title:{
    type: String,
    default: '',
  },
  start:{
    type: Date,
    default: new Date(),
  },
  end:{
    type: Date,
    default: new Date(),
  },
  venueName:{
    type: String,
    default: '',
  },
  meetingPurpose:{
      type: String,
      default: '',
  },
  meetingPartner:{
    type: String,
    default: '',
  },
  meetingPartnerId:{
    type: String,
    default: '',
  },
  statusNormal:{
      type:String,
      default:'snooze'
  },
  statusAdmin:{
    type:String,
    default:'snooze'
},
  mailSentNormal:{
      type:Number,
      default:0
  },
  mailSentAdmin:{
    type:Number,
    default:0
},
  createdOn :{
    type:Date,
    default: new Date()
  },
  modifiedOn :{
    type:Date,
    default: new Date()
  }



})


mongoose.model('MeetingModel', meetingSchema);