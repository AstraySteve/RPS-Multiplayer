/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables
var turn = 1; // Variable keep track of game phase
var messageList = $("#messageList");
var playerName = "";
var makePlayer1 = true;

//variables to determine which player you are
var isPlayer1 = false;
var isPlayer2 = false;

//variables Default values for waiting

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
    var p1 = snapshot.child('1');
    var p2 = snapshot.child('2');
    if (p1.exists() && p2.exists()){
        if (!isPlayer1 || !isPlayer2){
            $("#gameInfo").text("Game in Session");
        };
        console.log("game full");
        /* Run Game display both p1 and p2*/
        $("#p1Name").text(p1.val().playerName);
        $("#p1Score").text("Wins: " + p1.val().win + " Losses: " + p1.val().loss);
        $("#p2Name").text(p2.val().playerName);
        $("#p2Score").text("Wins: " + p2.val().win + " Losses: " + p2.val().loss);
        database.ref().update({phase: 1});
        console.log(p1.val().choice == null);
        if(isPlayer1){
            playerChoice = p1.val().choice;
            opponentChoice = p2.val().choice
        }
        else if(isPlayer2){
            playerChoice = p2.val().choice;
            opponentChoice = p1.val().choice
        }
        rpsGame(playerChoice, opponentChoice);
    }
    else{
        if(p1.exists()){
            /*Make Player 2 display player 1*/
            //console.log("making player 1")
            makePlayer1 = false;
            isPlayer2 = true;
            $("#p1Name").text(p1.val().playerName);
            $("#p1Score").text("Wins: " + p1.val().win + " Losses: " + p1.val().loss);
            $("#p2Name").text("Waiting for Player 2");
            $("#p2Score").empty();
        }
        else {
            /*Make Player 1*/
            makePlayer1 = true;
            isPlayer1 = true;
            if(p2.exists()){
                /*display player2*/
                //console.log("displaying player 2")
                $("#p2Name").text(p2.val().playerName);
                $("#p2Score").text("Wins: " + p2.val().win + " Losses: " + p2.val().loss);
                $("#p1Name").text("Waiting for Player 1");
                $("#p1Score").empty();
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

database.ref('/phase').on('value', function(phaseShot){
    //Listen event for phase change
    console.log(phaseShot.val());
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
    switch(makePlayer1){
        case true:
            key = "1";
            break;
        case false:
            key = "2";
    }

    var p = $("<p>").text("Hello: " + playerName + "! you are Player" + key);
    $("#gameInfo").append(p);
    var playerDataRef = database.ref('/players').child(key);
    playerDataRef.set({
        playerName: playerName,
        win: 0,
        loss: 0,
        choice: null
    });
    sendChatMessage("Has joined the game.");

    //Removes player data from database when client disconnect
    var newPost = database.ref().child('chat').push().key;
    var updates = {};
    updates['/chat/'+newPost] = {playerName: playerName, message: "Disconnected"};
    updates['/players/'+key] = null;
    database.ref().onDisconnect().update(updates);
}

function rpsGame(playerChoice, opponentChoice){
    //Function that holds the core game logic
    if ((playerChoice != null) && (opponentChoice != null)){
        //both choices have been made
        database.ref().update({phase: 2});
    }
    else{
        var gameList = ['Rock', 'Paper', 'Scissor'];
        
    }
}

//Main
//Shorthand for $(document).ready(function(){...});
$(function(){
    //Click event for username submit
    $("#addPlayer").on("click", function(){
        event.preventDefault();
        playerName = $("#playerName").val();
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
