const NUM_TEAMS = 64, REGIONS = 4;

var teams = {};
 
var generateTeams = function() {
  for (let i = 1; i <= NUM_TEAMS ; i++){ 
    teams["team" + i] = {
      "name" : "team" + i,
      "rank" : i,
      "seed" : Math.floor((i - 1) / REGIONS) + 1,
      "score1" : Math.random(),
    };
      if (i % REGIONS == 1) {
        teams["team" + i].region = [1, "East"]; 
      } else if (i % REGIONS == 2) {
        teams["team" + i].region = [2, "South"];
      } else if (i % REGIONS == 3) {
        teams["team" + i].region = [3, "Midwest"];
      } else { 
        teams["team" + i].region = [4, "West"];
      } 
  }
  console.log("Teams Generated - eg: Team 1 name = " + teams.team1.name);
};


// Create arrays for each region.  Populate based on the teams.teamX.region[0] value
var regionEast = [], regionSouth = [], regionMidWest = [], regionWest = [];
var allRegions = [regionEast, regionSouth, regionMidWest, regionWest];

var populateRegions = function(){
  // Question: I think this currTeam var makes the code more readable.  
  // Is it less performant? Would you keep or kill?
  var currTeam = "";
  for (var i = 0, x = allRegions.length; i < x; i++){
    for (var j = 1; j <= NUM_TEAMS ; j++){    
      currTeam = teams["team" + j] ;   
      if ( currTeam.region[0] == i + 1 ) {
        allRegions[i].push(currTeam); 
      }
    } 
  }
  console.log("Regions populated - eg: regionEast includes " + regionEast.length + " teams");
};

// Define playMatch variables
var favorite, underdog, winner, loser;

// NEW ATTEMPT AT MERGING ROUNDS 1 - 4
var playRounds = function() {
  // Outer Loop: do all for first 4 rounds of tournement. 
  for (var tournRound = 1; tournRound <= 1; tournRound ++) {
  var matches = 16; 
    for (let i = 0; i < tournRound; i++ ){
          matches /=  2 ;
        } 
    console.log("Playing " + matches + " Round " + tournRound +  " Matches!");

    // Middle Loop: do inner loop for each of 4 Regions. 
    for (var r = 0, x = allRegions.length; r < x; r++ ){
      let result = "" ;
      // console.log("Middle loop running " );

      // Inner Loop: match up the top and bottom seed for each region.  Play match.  
      for (var m = 0; m < matches; m ++){
        // console.log("Inner loop running");
        favorite = allRegions[r][m];
        console.log("Favorite assigned: " + favorite.name); 
        underdog = allRegions[r][(matches * 2 - 1)  - m ];
        console.log("underdog = " + underdog.name);

        // Game Outcome algo: if the favored team's score is > than their seed 
        // divided by the sum of the teams' seeds.  
        // eg: score: 0.200 > (seed 1 / (seed 1 + seed 5)) --> Favored Team wins

        if (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))){
          winner = favorite;
          
          // NOTE: This breaks it because it changes the lengths of the arrays.  Need to do later. 
          
          // loser = allRegions[r].splice((matches * 2 - 1) - m , 1);
        } else {
          winner = underdog;
          // loser = allRegions[r].splice(m, 1)
        };

        console.log("Favored team = " + favorite.name + "; winner = " + winner.name);
        winner["score" + (1 + tournRound)] = Math.random();

        round2allRegions[r].push(winner);

        // build up a "result" for a region, and pass that in all at once at the end
        result += "<br />" + favorite.seed + ". " + 
                favorite.name + " - " + 
                favorite["score" + tournRound].toFixed(3) + "<br / >" + 
                underdog.seed + ". " + underdog.name + 
                "<br /> Winner: " + winner.name + "<br />" ;
      }
      document.getElementById("sub_col_" + (r + 1) + "_" + tournRound).innerHTML += result;
    }
  }
}; 
 



// Build arrays for Round 2.  As each match is played, the winner is passed into the Round2 array
var round2regionEast = [], 
    round2regionSouth = [], 
    round2regionMidWest = [], 
    round2regionWest = [];

var round2allRegions = [round2regionEast, round2regionSouth, round2regionMidWest, round2regionWest];

// Each of the next 4 RoundX functions are very similar... 
var playRound1 = function() {
  var tournRound = 1, matches = 16; 
  for (let i = 0; i < tournRound; i++ ){
        matches /=  2 ;
      } 
  console.log("Playing " + matches + " Round " + tournRound +  " Matches!");
  
  // Outer Loop: do inner loop for each of 4 Regions. 
  for (var r = 0, x = allRegions.length; r < x; r++ ){
    let result = "" ;
    console.log("Outer loop running");

    // Inner Loop: match up the top and bottom seed for each region.  Play match.  
    for (var m = 0; m < matches; m ++){
      console.log("Inner loop running");
      favorite = allRegions[r][m];
      console.log("Favorite assigned: " + favorite.name); 
      underdog = allRegions[r][(matches * 2 - 1)  - m ];
      console.log("underdog = " + underdog.name);
      
      // Game Outcome algo: if the favored team's score is > than their seed 
      // divided by the sum of the teams' seeds.  
      // eg: score: 0.200 > (seed 1 / (seed 1 + seed 5)) --> Favored Team wins

      if (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))){
        winner = favorite;
        allRegions[r].splice((matches * 2 - 1) - m , 1);
      } else {
        winner = underdog;
        allRegions[r].splice(m, 1)
      };
      
      console.log("Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["score" + (1 + tournRound)] = Math.random();
      
      round2allRegions[r].push(winner);

      // build up a "result" for a region, and pass that in all at once at the end
      result += "<br />" + favorite.seed + ". " + 
              favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) + "<br / >" + 
              underdog.seed + ". " + underdog.name + 
              "<br /> Winner: " + winner.name + "<br />" ;
    }
    document.getElementById("sub_col_" + (r + 1)).innerHTML += result;
  }
}; 

var round3regionEast = [];
var round3regionSouth = [];
var round3regionMidWest = [];
var round3regionWest = [];

var round3allRegions = [round3regionEast, round3regionSouth, round3regionMidWest, round3regionWest];


var playRound2 = function() {
  var tournRound = 2;
  var matches = 8 / tournRound;
  console.log("Playing Round 2 Matches!");
  for (var r = 0; r < allRegions.length; r++ ){
    let result = "" ;
    for (var m = 0; m < matches; m ++){
      favorite = round2allRegions[r][m];
      underdog = round2allRegions[r][(8 - 1) - m];
      winner = (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))) 
        ? favorite : underdog ;
      console.log("Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["round" + tournRound] = "winner!";
      winner["score" + (1 + tournRound)] = Math.random();
      round3allRegions[r].push(winner);

      result += "<br />" + favorite.seed + ". " + favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) +
              "<br / >" + underdog.seed + ". " + underdog.name + "<br /> Winner: " + winner.name + 
              "<br />" ;
    }
    document.getElementById("sub_col_" + (r + 1) + "_" + tournRound).innerHTML += result;
  } 
}; 

var round4regionEast = [];
var round4regionSouth = [];
var round4regionMidWest = [];
var round4regionWest = [];

var round4allRegions = [round4regionEast, round4regionSouth, round4regionMidWest, round4regionWest];


var playRound3 = function() {
  var tournRound = 3;
  var matches = 8 / 4;
  console.log("Playing Round 3 Matches!");
  for (var r = 0; r < allRegions.length; r++ ){
    let result = "" ;
    for (var m = 0; m < matches; m ++){
      favorite = round3allRegions[r][m];
      underdog = round3allRegions[r][(4 - 1) - m];
      winner = (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))) 
        ? favorite : underdog ;
      console.log("Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["round" + tournRound] = "winner!";
      winner["score" + (1 + tournRound)] = Math.random();
      round4allRegions[r].push(winner);

      result += "<br />" + favorite.seed + ". " + favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) +
              "<br / >" + underdog.seed + ". " + underdog.name + "<br /> Winner: " + winner.name + 
              "<br />" ;
    }
    document.getElementById("sub_col_" + (r + 1) + "_" + tournRound).innerHTML += result;
  } 
}; 

var round5regionEast = [];
var round5regionSouth = [];
var round5regionMidWest = [];
var round5regionWest = [];

var round5allRegions = [round5regionEast, round5regionSouth, round5regionMidWest, round5regionWest];
var finalFour = []

var playRound4 = function() {
  var tournRound = 4;
  var matches = 8 / 4 / 2;
  console.log("Playing Round 4 Matches!");
  for (var r = 0; r < allRegions.length; r++ ){
    let result = "" ;
    for (var m = 0; m < matches; m ++){
      favorite = round4allRegions[r][m];
      underdog = round4allRegions[r][(2 - 1) - m];
      winner = (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))) 
        ? favorite : underdog ;
      console.log("Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["round" + tournRound] = "winner!";
      winner["score" + (1 + tournRound)] = Math.random();
      round5allRegions[r].push(winner);
      finalFour.push(winner);

      result += "<br />" + favorite.seed + ". " + favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) +
              "<br / >" + underdog.seed + ". " + underdog.name + "<br /> Winner: " + winner.name + 
              "<br />" ;
    }
    document.getElementById("sub_col_" + (r + 1) + "_" + tournRound).innerHTML += result;
  } 
};

// var finalFour = [round5regionEast[0], round5regionSouth[0], round5regionMidWest[0], round5regionWest[0]];

var champGame = [];
 
var playFinalFour = function (){
    tournRound = 5;
    let result = "" ;
    console.log("Playing Final Four!");
    for (var m = 0; m < 3; m += 2){
      favorite = finalFour[m];
      underdog = finalFour[m + 1];
      winner = (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))) 
        ? favorite : underdog ;
      console.log("FF Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["round" + tournRound] = "winner!";
      winner["score" + (1 + tournRound)] = Math.random();
      champGame.push(winner);

      result += "<br />" + favorite.region[1] + ": " + 
              favorite.seed + ". " + favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) +
              "<br / >" + underdog.region[1] + ": " + 
              underdog.seed + ". " + underdog.name + 
              "<br /> Winner: " + winner.name + 
              "<br />" ;
    }
    document.getElementById("final_four").innerHTML += result;
};

var playChampionship = function (){
    tournRound = 6;
    let result = "" ;
    console.log("Playing Championship Game!");
      favorite = champGame[0];
      underdog = champGame[1];
      winner = (favorite["score" + tournRound] > (favorite.seed / ( favorite.seed + underdog.seed))) 
        ? favorite : underdog ;
      console.log("FF Favored team = " + favorite.name + "; winner = " + winner.name);
      winner["round" + tournRound] = "winner!";
      winner["score" + (1 + tournRound)] = Math.random();

      result += "<br />" + favorite.region[1] + ": " + 
              favorite.seed + ". " + favorite.name + " - " + 
              favorite["score" + tournRound].toFixed(3) +
              "<br / >" + underdog.region[1] + ": " + 
              underdog.seed + ". " + underdog.name + 
              "<br /> Winner: " + winner.name + 
              "<br />" ;
    document.getElementById("champ_game").innerHTML += result;
}; 

