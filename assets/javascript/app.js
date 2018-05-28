/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables
var messageList = $("#messageList");
var playerName = "Annon";
var playerNode = null;
var makePlayer1 = true;
var playerChoice;
var opponentChoice;
var winScore = 0;
var loseScore = 0;

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
        if (!isPlayer1 && !isPlayer2){
            $("#gameInfo").html("<p style='text-align: center'>Game in Session</P>");
        };
        //console.log("game full");
        /* Run Game display both p1 and p2*/
        $("#p1Name").text(p1.val().playerName);
        $("#p1Score").text("Wins: " + p1.val().win + " Losses: " + p1.val().loss);
        $("#p2Name").text(p2.val().playerName);
        $("#p2Score").text("Wins: " + p2.val().win + " Losses: " + p2.val().loss);
        database.ref().update({phase: 1});
        if(isPlayer1){
            playerChoice = p1.val().choice;
            opponentChoice = p2.val().choice
        }
        else if(isPlayer2){
            playerChoice = p2.val().choice;
            opponentChoice = p1.val().choice
        }
        rpsGame();
    }
    else{
        if(p1.exists()){
            /*Make Player 2 display player 1*/
            //console.log("making player 1")
            makePlayer1 = false;
            $("#p1Name").text(p1.val().playerName);
            $("#p1Score").text("Wins: " + p1.val().win + " Losses: " + p1.val().loss);
            $("#p2Name").text("Waiting for Player 2");
            $("#p2Score").empty();
            $("#p1Zone").empty();
        }
        else {
            /*Make Player 1*/
            makePlayer1 = true;
            if(p2.exists()){
                /*display player2*/
                //console.log("displaying player 2")
                $("#p2Name").text(p2.val().playerName);
                $("#p2Score").text("Wins: " + p2.val().win + " Losses: " + p2.val().loss);
                $("#p1Name").text("Waiting for Player 1");
                $("#p1Score").empty();
                $("#p2Zone").empty();
            }
            else{
                //Clears database if no players exists
                database.ref().remove();
            }
        }
    }
    //DEBUG CODE REMOVE WHEN DONE
    //console.log(snapshot.val());
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
    //Listen event for phase change, update scores
    if (phaseShot.val()==2){
        var status = compareChoice();
        database.ref('/players/'+ playerNode).update({choice : null});
        database.ref().update({phase: 1});
        if (status == 'win'){
            winScore++;
            database.ref('/players/'+ playerNode).update({win : winScore});
            //console.log("win");
        }
        else if (status == "lose"){
            loseScore++;
            database.ref('/players/'+ playerNode).update({loss : loseScore});
            //console.log('lose');
        }
    }
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
    switch(makePlayer1){
        case true:
            playerNode = "1";
            isPlayer1 = true;
            break;
        case false:
            playerNode = "2";
            isPlayer2 = true;
    }

    var p = $("<h5>").text("Hello: " + playerName + "! You are Player " + playerNode);
    $("#gameInfo").append(p);
    var playerDataRef = database.ref('/players').child(playerNode);
    playerDataRef.set({
        playerName: playerName,
        win: winScore,
        loss: loseScore,
        choice: null
    });
    sendChatMessage("Has joined the game.");

    //Removes player data from database when client disconnect
    var newPost = database.ref().child('chat').push().key;
    var updates = {};
    updates['/chat/'+newPost] = {playerName: playerName, message: "Disconnected"};
    updates['/players/'+ playerNode] = null;
    updates['/phase'] = null;
    database.ref().onDisconnect().update(updates);
}

function rpsGame(){
    //Function that holds the core game logic
    if ((playerChoice != null) && (opponentChoice != null)){
        //both choices have been made
        displayChoice();
        setTimeout(function(){
            database.ref().update({phase: 2});
        }, 2000);
    }
    else{      
        if(playerChoice == null && isPlayer1){
            buildButtons(1);
        }
        else if(playerChoice == null && isPlayer2){
            buildButtons(2);
        }
    }
}

function buildButtons(player){
    //Function dynamically builds the Rock Paper Scissor Choices
    var gameList = ['Rock', 'Paper', 'Scissor'];
    if (player == 1){
        var playerZone = $("#p1Zone");
    }
    else if(player ==2){
        var playerZone = $("#p2Zone");
    }
    else{
        console.log("ERROR not a player");
    }
    $("#p1Zone").empty();
    $("#p2Zone").empty();
    for (i=0; i<gameList.length; i++){
        var button = $("<button>");
        button.attr({
            class: "btn btn-block rpsButton m-1",
            'data-name': gameList[i],
        });
        button.text(gameList[i]);
        playerZone.append(button);
    }
}

function compareChoice(){
    //Function compares player choices and returns 'win' 'lose' or 'draw'
    switch(playerChoice){
        case 'Rock':
            switch(opponentChoice){
                case 'Scissor':
                    return 'win';
                case 'Paper':
                    return 'lose';
            }
            break;
        case 'Paper':
            switch(opponentChoice){
                case 'Rock':
                    return 'win';
                case 'Scissor':
                    return 'lose';
            }
            break;
        case 'Scissor':
            switch(opponentChoice){
                case 'Paper':
                    return 'win';
                case 'Rock':
                    return 'lose';
            }
            break;
        default:
            return 'draw';
    }
}

function displayChoice(){
    if (isPlayer1){
        var p1 = playerChoice;
        var p2 = opponentChoice;
    }
    else{
        var p2 = playerChoice;
        var p1 = opponentChoice;
    }
    $("#p1Zone").empty();
    $("#p1Zone").html("<h5>" + p1 + "</h5>");
    $("#p2Zone").empty();
    $("#p2Zone").html("<h5>" + p2 + "</h5>");
}

//Main
//Shorthand for $(document).ready(function(){...});
$(function(){
    //Click event for username submit
    $("#addPlayer").on("click", function(event){
        event.preventDefault();
        playerName = $("#playerName").val();
        winScore = 0;
        loseScore = 0;
        $("#gameInfo").empty();
        assignPlayer();
        document.getElementById("submitMessage").disabled = false;
    });

    //Click event for RPS buttons and updates database of choice
    $(".gameBox").on('click', '.rpsButton', function(){
        var choice = $(this).attr("data-name")
        if (isPlayer1){
            database.ref('players/1').update({choice: choice})
            $("#p1Zone").empty();
            $("#p1Zone").html("<h5>" + choice + "</h5>");
        }
        else if (isPlayer2){
            database.ref('players/2').update({choice: choice})
            $("#p2Zone").empty();
            $("#p2Zone").html("<h5>" + choice + "</h5>");
        }
        else{
            console.log("ERROR not a player choice");
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
