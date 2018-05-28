# RPS-Multiplayer
In this project we build an online version of the Rock Paper Scissor game with the help of Firebase database

##How to play:
1. Enter player name in field unless game is full
    1. You will be assiged as either player 1 or 2
1. Once 2 players are in the game, the game starts
1. Choose between 'Rock' 'Paper' or 'Scissor' and wait until opponent finish their choice
1. Player choices are hidden until both players made a choice
1. Game will reveal each player choice and tally up the score
    1. only win/loss score are recorded. Draws will not affect score
1. Repeat
1. Refresh or close window to leave game

* Once a player is assigned as either player 1 or 2, the chat bar will become active
* messages can be seen by all players and any observers

####Features:
* Auto assigns players as either player 1 or 2, anyone joins after are not assigned and are considered an observer
* Chat will notify when a player join and leaves
* Chat will clear itself upon creation of a new game (when there are no player 1 or 2)

####Features not implemented:
* Observers watching the game when game is full will not be able to join game when a player leaves, a page refresh is needed.

####Known Bugs:
Certain features are only triggered after an action
* example would be the chat not clearing if last player refresh page to disconnect.