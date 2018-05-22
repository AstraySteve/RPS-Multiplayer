/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables
var turn = 1; // Variable keep track of game phase

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
database.ref().on("value", function(snapshot){
    /*
        TODO: refer to values on db structure and perform html hookups
    */
    
});

//Functions

//Main
//Shorthand for $(document).ready(function(){...});
$(function(){

    //Click event for username submit
    $("#addPlayer").on("click", function(){
        event.preventDefault();
        var username = $("#username").val();
        console.log(username);

        //TEST CODE ADJUST AS NEEDED REMOVE WHEN DONE
        var key = database.ref().child('players').push().key
        console.log(key);
        var updates = {};
        updates['players/'+key] = {username: "hello world"};
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
        //TEST CODE END

    });
});

//TEMP CODE TEST CODE REMOVE WHEN DONE
database.ref('players/player1').set({
    username: "bob",
});

database.ref('players/player2').set({
    username: "billy",
});



