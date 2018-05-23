/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables
var turn = 1; // Variable keep track of game phase
var messageList = $("#messageList");
var playerName = "";
var isFull = false; //Flag to check if game is full
var isPlayer1 = true;

//Initialize Firebase
var config = {
    apiKey: "AIzaSyDMcIax-DelXI_aN0duFPB7DZy6bDnUrMc",
    authDomain: "rps-multiplayer-7797e.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-7797e.firebaseio.com",
    projectId: "rps-multiplayer-7797e",
    storageBucket: "rps-multiplayer-7797e.appspot.com",
    messagingSenderId: "857017595775"
};
firebase.initializeApp(config);
var database = firebase.database();

//Listen for value events
database.ref('/players').on('value', function(snapshot){
    //Listen event for players
    if (snapshot.child('player1').exists() && snapshot.child('player2').exists()){
        isFull = true;
        console.log("game full");

        /* Run Game display both p1 and p2*/
    }
    else{
        isFull = false;
        if(snapshot.child('player1').exists()){
            /*Make Player 2 display player 1*/
            isPlayer1 = false;
        }
        else {
            /*Make Player 1*/
            isPlayer1 = true;
            if(snapshot.child('player2').exists()){
                /*display player2*/
            }
            else{
                //Clears database if no players exists
                database.ref().remove();
            }
        }
    }
    //DEBUG CODE REMOVE WHEN DONE
    console.log(snapshot.val());
});

database.ref('/chat').on('child_added', function(chatsnapshot){
    //Listen event for chat messages
    if (messageList.text() == ""){
        //Account for the first blank entry
        messageList.text(`${chatsnapshot.val().playerName}: ${chatsnapshot.val().message}`);
    }
    else{
        var previousText = messageList.text();
        messageList.text(`${previousText}\n${chatsnapshot.val().playerName}: ${chatsnapshot.val().message}`);
    }
    //auto scroll to bottom of textarea, show latest chat
    messageList.scrollTop(messageList[0].scrollHeight);
});

//Functions
function sendChatMessage(message){
    //Function to send messages to database, change will trigger listen 'chat' event
    var ref = database.ref("/chat");
    ref.push().set({
        playerName: playerName,
        message: message
    });
}

function assignPlayer(){
    //Function assigns player as either player 1 or 2
    var key;
    switch(isPlayer1){
        case true:
            key = "player1";
            break;
        case false:
            key = "player2";
    }

    $("#gameInfo").text("Hello: " + playerName + "you are " + key);
    var playerDataRef = database.ref('/players').child(key);
    playerDataRef.set({
        playerName: playerName,
        win: 0,
        loss: 0,
        choice: ""
    });
    sendChatMessage("Has joined the game.");
    //Removes player data from database when client disconnect
    var newPost = database.ref().child('chat').push().key;
    var updates = {};
    updates['/chat/'+newPost] = {playerName: playerName, message: "Disconnected"};
    updates['/players/'+key] = null;
    database.ref().onDisconnect().update(updates);
}

//Main
//Shorthand for $(document).ready(function(){...});
$(function(){
    //Click event for username submit
    $("#addPlayer").on("click", function(){
        event.preventDefault();
        playerName = $("#playerName").val();
        //console.log(playerName);
        $("#gameInfo").empty();
        assignPlayer();
    });

    //Click event for message field submit
    $("#submitMessage").on("click", function(event){
        event.preventDefault();
        var message = $("#message").val();
        sendChatMessage(message);
        //Clear chat fields
        $("#message").val("");
    });
});
