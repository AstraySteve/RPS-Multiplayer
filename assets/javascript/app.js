/*
    Steven Tran
    Assignment 7, 2018
    UofT SCS Coding Bootcamp
*/

//Global Variables

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

//Main
