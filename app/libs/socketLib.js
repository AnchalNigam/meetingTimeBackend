//imprt modules
const socketio=require('socket.io');

const shortid = require('shortid');
const logger = require('./loggerLib.js');
const tokenLib = require("./tokenLib.js");
const eventEmitter=require("./../Events/allEvents");
const event=eventEmitter.emitter;


let setServer=(server)=>{
    let allOnlineUsers=[];
    let io = socketio.listen(server);
    
    let myIo = io.of('')
    myIo.on('connection',(socket)=>{
        console.log(`connection takes place--next to verify user`);
        //emiting event to verify user
       socket.emit('verifyUser',"");
       //listening setuser event for verifying user
       
       socket.on('setUser',(authToken)=>{
        console.log("set-user called");
        tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
            if(err){
                console.log('authentication error');
            }
            else{
                console.log("user is verified..setting details");
                let currentUser = user.data;
                
                // setting socket user id 
                socket.userId = currentUser.userId
                let fullName = `${currentUser.firstName} ${currentUser.lastName}`
               
                let userObj = {userId:currentUser.userId,fullName:fullName}
                allOnlineUsers.push(userObj)
                allOnlineUsers.filter((obj, pos, arr) => {
                    return arr.map(mapObj => mapObj['userId']).indexOf(obj['userId']) === pos;
                });
               
                console.log(allOnlineUsers);
                 // setting room name
                 socket.room = 'meeting'
                 // joining chat-group room.
                 socket.join(socket.room)
                 myIo.emit('online-user-list',allOnlineUsers);

             
            }
        });

       }); //set user event end

    //event to listen create action

       socket.on('create-meeting', (meetingDetails) => {
        console.log("socket create-meeting called")
        meetingDetails.meetingDetails.operationName="create";
        

        // event to save meeting
        setTimeout(function(){
            event.emit('save-meeting', meetingDetails.meetingDetails);
            event.emit('send-mail',meetingDetails.meetingDetails);

        },1000)
        myIo.emit(meetingDetails.meetingDetails.meetingPartnerId,meetingDetails);

    });

    //event to listen update action
    socket.on('update-meeting', (meetingDetails) => {
        console.log("socket update-meeting called")
        meetingDetails.meetingDetails.operationName="update";
        

        //event to update meeting
        setTimeout(function(){
            event.emit('save-update-meeting', meetingDetails.meetingDetails);
            event.emit('send-mail',meetingDetails.meetingDetails);

        },1000)
        myIo.emit(meetingDetails.meetingDetails.meetingPartnerId,meetingDetails);

    });//end

    //event to listen delete action
    socket.on('delete-meeting', (meetingDetails) => {
        console.log("socket delete-meeting called")
        meetingDetails.operationName="delete";
        

        // event to delete meeting
        setTimeout(function(){
            event.emit('meeting-deletion', meetingDetails);
            event.emit('send-mail',meetingDetails);

        },1000)
        myIo.emit(meetingDetails.meetingPartnerId,meetingDetails);

    });//end

    //event to remind abour meeting
    socket.on('remind-event', (meetingDetails) => {
        console.log("socket remind event called")
        if(meetingDetails.user=="normal"){
            event.emit('remind-mail-normal', meetingDetails);
        }
        else{
            event.emit('remind-mail-admin', meetingDetails);
        }
        
    });//end

    //event to update meeting status to dismiis on remaind
    socket.on('remind-event-update', (meetingDetails) => {
        console.log("socket remind event update called")
       
            event.emit('remind-event-update-status', meetingDetails);
        
        
    });//end

    //event to update meeting mail sent to 1 on remaind
    socket.on('mail-remind-event-update', (meetingDetails) => {
        console.log("socket mail remind event update called")
       
            event.emit('mail-remind-event-update-mailSent', meetingDetails);
        
        
    });//end

        //disconnect socket
        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            myIo.emit('online-user-list',allOnlineUsers);
            socket.leave(socket.room)
            socket.disconnect(0);
        }) // end of on disconnect

        //disconnect socket
        socket.on('disconnection', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            myIo.emit('online-user-list',allOnlineUsers);
            socket.leave(socket.room)
            socket.disconnect(0);
        }) // end of on disconnect


       

    });// socket end

};

module.exports={
    setServer:setServer
  }