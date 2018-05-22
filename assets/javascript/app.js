/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables
var turn = 1; // Variable keep track of game phase
var messageList = $("#messageList");
var playerName = "";

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
        console.log(playerName);

        $("#gameInfo").empty();
        $("#gameInfo").text("Hello: " + playerName);

        var playerDataRef = database.ref('/players').child('/player1');
        playerDataRef.set({
            playerName: playerName,
            score: 0
        });

        playerDataRef.onDisconnect().update({
            score: "Offline"
        });
        /*
        //TEST CODE ADJUST AS NEEDED REMOVE WHEN DONE
        var key = database.ref().child('players').push().key
        console.log(key);
        var updates = {};
        updates['players/'+key] = {username: playerName};
        database.ref().update(updates);
        
        database.ref().on("value", function(snapshot) {
            if(snapshot.child("players").exists()){
                console.log("players exists")
            }
            if(snapshot.child("player1").exists()){
                console.log("player1 exist");
            }
            else if(snapshot.child("players").child("player1").exists()){
                console.log("player1 exist nested");
            }
            else{
                console.log("cannot find player1");
            }
        });
        //TEST CODE END*/

    });

    //Click event for message field submit
    $("#submitMessage").on("click", function(event){
        event.preventDefault();
        //console.log(this);
        var message = $("#message").val();
        sendChatMessage(message);

        //Clear chat fields
        $("#message").val("");
    });
});

/*
//TEMP CODE TEST CODE REMOVE WHEN DONE
database.ref('players/player1').set({
    username: "bob",
});

database.ref('players/player2').set({
    username: "billy",
});
*/
