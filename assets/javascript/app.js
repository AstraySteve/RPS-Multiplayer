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
        /* Run Game */
    }
    else{
        isFull = false;
        if(snapshot.child('player1').exists()){
            /*Make Player 2*/
            isPlayer1 = false;
        }
        else {
            /*Make Player 1*/
            isPlayer1 = true;
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

    //DEBUG CODE REMOVE WHEN DONE
    //console.log(childsnapshot.val());
});

//Functions
function sendChatMessage(message){
    //Function to send messages to database, change will trigger listen 'chat' event
    var ref = firebase.database().ref("/chat");
    ref.push().set({
        playerName: playerName,
        message: message
    });
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
        if (isFull){
            $("#gameInfo").text("Game Full!");
        }
        else{
            var key;
            switch(isPlayer1){
                case true:
                    console.log("creating player1");
                    key = "player1";
                    break;
                case false:
                    console.log("creating player2");
                    key = "player2";
            }
            
            $("#gameInfo").text("Hello: " + playerName);

            var playerDataRef = database.ref('/players').child(key);
            playerDataRef.set({
                playerName: playerName,
                score: 0
            });
            //Removes player data from database when client disconnect
            playerDataRef.onDisconnect().remove();
        }
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

