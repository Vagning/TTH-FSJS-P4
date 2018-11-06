
// Add self-executing function
(function(){

  // Initialize variables
  var winningRows = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
  var oMoves = [];
  var xMoves = [];
  var filledSquares = [];
  var fillCount = 0;
  var winner;
  var xSquareClicked;
  var oSquareClicked;


  $(function(){

    //Hide the board on load.
    $("#board").hide();

    //Append start screen
    $("body").append('<div class="screen screen-start" id="start"><header> <h1>Tic Tac Toe</h1><div id="startMenu"><div id="gameType"><p><label class="label" for="ai">Play against the AI? </label><input type="radio" name="opponent" value="ai" id="ai"></p><p><label for="human" class="label">Play against another human? </label><input type="radio" name="opponent" id="human" value="human"></p></div></div><a href="#" class="button" id="startbutton">Start game</a> </header></div>');
    $("#startMenu").append("<div id='nameDiv'></div>");

    $("input[name='opponent']").change(function() {
      if ($("input[name='opponent']:checked").val() === 'ai') {
        //console.log('ai!'); //For debugging
        $("#nameDiv").html("<p><label for='playerName'>Enter player name:</label></p><p><input type='text' id='playerName' name='playerName'</p>");


      } else if ($("input[name='opponent']:checked").val() === 'human') {
        //console.log('human!'); //For debugging
        $("#nameDiv").html("<p><label for='playerName'>Enter Player 1  name:</label></p><p><input type='text' id='playerName' name='playerName'</p><p><label for='playerName2'>Enter Player 2 name:</label></p><p><input type='text' id='playerName2' name='playerName'</p>");
      }

    })

    //Append winning screen and hide it afterwards
    $("body").append('<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button restartGame">New game</a></header></div>');

    $("#finish").hide();

    //Insert p to store player names in.
    $("header ul").after('<p class="playerName" style="width:100%;"><span id="player1Name" style="margin-left:20%;"></span><span id="player2Name" style="margin-left:58%;"></span></ul>');


    //Start button will set the player names (if you play against the "AI" the name will be set to "HAL 9000" ;-)), the start screen will be hided and the board will be shown.
    $("#startbutton").click(function(event){
      event.preventDefault();

      //Set player 1 name from the input field. Player 2's name is determined by the game type
      $("#player1Name").text($("#playerName").val());
      
      //Check if game is against "AI" og another human
      if ( $("input[name='opponent']:checked").val() === "ai" ) {
        //If the game type is AI set player 2 name to "HAL 9000" and start AI game
        $("#player2Name").text("HAL 9000");
        singlePlayerGame();

      } else if (($("input[name='opponent']:checked").val()) === "human" ) {
        //If the game type is human set player 2 name according to the input field
        $("#player2Name").text($("#playerName2").val());
        twoPlayerGame();

      }

      //Hide start screen
      $("#start").hide();

      //Set player 1 as active player 
      $("#player1").addClass("active");

      // Show the board
      $("#board").show();

    });


    //Hovering over the boxes will show O or X depending on who's turn it is. If the game type is AI, hovering over a box will the turn is for player 2 nothing will happen.
    function hover(){
        $(".boxes li").hover(function () {
            if ($("#player1").hasClass("active")) {
              $(this).css("background-image", "url(./img/o.svg)");
            
            } else if ( $("input[name='opponent']:checked").val() === "human" && $("#player2").hasClass("active"))  {
              $(this).css("background-image", "url(./img/x.svg)");

            }
        }, function() {
          $(this).css("background-image", "none");

        });
     }
     hover();

    //function for initiating a signlePlayerGame
    function singlePlayerGame() {
      $(".boxes li").click(function(){
        //Reset variables used to determid if game should end.
        fillCount = 0; 
        winner = false; 

        //Get which square O clicked. Logging it for debugging
        oSquareClicked = $(".boxes li").index($(this));
        console.log("Clicked square is " + oSquareClicked);

        //If it is O's turn use the clicksquare and mark it
        if ($("#player1").hasClass("active")) {
          playerOsMove(oSquareClicked);
        }
        
        //After O's square have been marked, check if game is over with a winner og a draw.
        winnerTest();
        drawTest();

        //If no no end "state" (winner or draw) was found change player turn
        if ((!winner) && (fillCount < 9)) {
          $("#player1").toggleClass("active");
          $("#player2").toggleClass("active");

          //add a little wait before running the "AI" choice as it makes it seem more natural. 
          setTimeout(computerChooseExSquare, 200);
        }

      }); 

    }


    function twoPlayerGame() {
      $(".boxes li").click(function(){
        //Reset variables used to determid if game should end.
        fillCount = 0; 
        winner = false; 

        //Get which square Player clicked. Logging it for debugging
        squareClicked = $(".boxes li").index($(this));
        console.log("Clicked square is " + squareClicked);

        //Determin if it is O or X to take a turn
        if ($("#player1").hasClass("active")) {
          //O turn
          playerOsMove(squareClicked);

        } else {
          //X turn
          playerXsMove(squareClicked);
        }

        //After players square have been marked, check if game is over with a winner og a draw.
        winnerTest();
        drawTest();

        //Toggle active player
        $("#player1").toggleClass("active");
        $("#player2").toggleClass("active");

      });

    } 


    function playerOsMove(squareClicked) {
      
      //Change background to .svg for the passed square
      $(".boxes li").eq(squareClicked).addClass("box-filled-1");
      
      //Pushed the passed square to the array of o Moves and to the array of filled squares
      oMoves.push(squareClicked);
      filledSquares.push(squareClicked);
      
      //When the square have been selected, disabled the hover effect for it
      $(".boxes li").eq(squareClicked).off();

    }

    function playerXsMove(squareClicked) {

      //Change background to .svg for the passed square
      $(".boxes li").eq(squareClicked).addClass("box-filled-2");
      
      //Pushed the passed square to the array of x Moves and to the array of filled squares
      xMoves.push(squareClicked);
      filledSquares.push(squareClicked);
      
      //When the square have been selected, disabled the hover effect for it
      $(".boxes li").eq(squareClicked).off();

    } 

    //Function pretending to be an AI. All in all it's a function using random number and small amout of logic to test if it's a ok choice.
    function computerChooseExSquare(){

      //generate a number between 1 and 9 and use as the index for the square the "AI" want to click.
      xSquareClicked = Math.floor(Math.random() * 9);
     
      //Check if square if empty. it true that's choosen
      if (filledSquares.indexOf(xSquareClicked) === -1) {
        xChoice();

      } else {

        //If the wanted square is not empty generate new random number which isn't used. This mean that potenially the script can run for a long time, this should be improved.The while loop will stop if all squares a filled.
        while ((filledSquares.indexOf(xSquareClicked) > -1) && (filledSquares.length != 9)) {
          xSquareClicked = Math.floor(Math.random() * 9);
        
        }
        
        xChoice();

      }

      //After players square have been marked, check if game is over with a winner og a draw.
      winnerTest();
      drawTest();

      //Toggle active player
      $("#player1").toggleClass("active");
      $("#player2").toggleClass("active");

    }

    //This function takes the choosen square for the X and change background to .svg for the square
    function xChoice(){
      $(".boxes li").eq(xSquareClicked).addClass("box-filled-2");
      $(".boxes li").eq(xSquareClicked).css("background-image", "url(./img/x.svg)");

      ///Pushed the passed square to the array of x Moves and to the array of filled squares
      xMoves.push(xSquareClicked);
      filledSquares.push(xSquareClicked);
      
       //When the square have been selected, disabled the hover effect for it
      $(".boxes li").eq(xSquareClicked).off();
    }

    //Function for testing it and winning state has been reached for any of the players (human or AI)
    function winnerTest(){
      // Test state of board against possible solutions
      /* I need to check whether the three values in any of winningRows's sub-arrays are all
         included in oMoves or xMoves. If they are, game is over. If they are not, we keep going
         until there is a draw or a winner.
      */

      //Will loop through all winning row combos
      for (var i=0; i<winningRows.length; i++){

        fillCount = 0;
        //Setting variables for testing the 3 positions in each winning combo
        var position0 = winningRows[i][0];
        var position1 = winningRows[i][1];
        var position2 = winningRows[i][2];

        //Check if o moves contains all of the positions in this winning combo
        if ((oMoves.indexOf(position0) > -1) && (oMoves.indexOf(position1) > -1) && (oMoves.indexOf(position2) > -1)) {
          //If o moves conatins all of the positions trigger winner message by hiding the board and showing the winning screen with the name of the player.

          winner = true;

          $("#board").hide();
          $(".message").text(($("#player1Name").text()) + " wins");
          $(".screen-win").addClass("screen-win-one");
          $("#finish").show();


        } else if ((xMoves.indexOf(position0) > -1) && (xMoves.indexOf(position1) > -1) && (xMoves.indexOf(position2) > -1)) {
          //If o moves conatins all of the positions trigger winner message by hiding the board and showing the winning screen with the name of the player or the AI depening of the gamemode.

          winner = true;

          $("#board").hide();
          if ( $("input[name='opponent']:checked").val() == "ai" ) {
            $(".message").text("HAL 9000 wins");
      
          } else {
            $(".message").text(($("#player2Name").text()) + " wins");
      
          }
          $(".screen-win").addClass("screen-win-two");
          $("#finish").show();
      
        }
      }
    }

    //Function for testing if the game have reached a point in which it is draw.
    function drawTest(){
      
      //first looping through all boxes in order to count how many have been filled in total.
      $(".boxes li").each(function(){
        if ( $(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) {
          fillCount += 1;
        }
      });

      //Since the draw test always a running after the winner test (setting the winner var), if all squares have been filled the game must be draw.
      if ((fillCount == 9) && (!winner)) {
        //Show the messages and hide the board.
        $(".message").text("It's a tie!");
        $(".screen-win").addClass("screen-win-tie");
        $("#board").hide();
        $("#finish").show();

      }

    }

    //Clicking on the new game button will trigger will clear the squares and reset all variables used in the game. Basically resetting the game back to the place before the first game began.
    $(".restartGame").click(function(event){
      event.preventDefault();

      //Clearing all the filled squares.
      $(".boxes li").removeClass("box-filled-1");
      $(".boxes li").removeClass("box-filled-2");
      $(".boxes li").css("background-image", "none");

      //Reset all arrays
      oMoves = [];
      xMoves = [];
      filledSquares = [];
      fillCount = 0;
      winner = false;

      //Make sure player1 is active starting player.
      $("#player1").addClass("active");
      $("#player2").removeClass("active");

      //Clear all winning (and draw) screens.
      $(".screen-win").removeClass("screen-win-one");
      $(".screen-win").removeClass("screen-win-two");
      $(".screen-win").removeClass("screen-win-tie");
      $(".message").text("");

      //Turning the hover effect on, on all squares again.
      $(".boxes li").off();
      hover();
      
      //Call the same game mode as first given.
      if ( $("input[name='opponent']:checked").val() == "ai" ) {
        singlePlayerGame();
      } else if (($("input[name='opponent']:checked").val()) == "human" ) {
        twoPlayerGame();
      }

      $("#finish").hide();
      $("#board").show();

    });


  });

}()); 
