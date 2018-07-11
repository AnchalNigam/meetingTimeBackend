'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userType:{
    type: Number,
    default: 1

  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  userName:{
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: String,
    default: 0
  },
  country:{
    type: String,
    default: ''
  },
  hash:{
     type:String,
     default:'hahahdhjaadhadahdda'
  },
  active:{
    type:Boolean,
    default:false
  },
  createdOn :{
    type:Date,
    default: new Date()
  }


})


mongoose.model('User', userSchema);