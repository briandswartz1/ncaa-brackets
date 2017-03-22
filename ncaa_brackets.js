
const REGION_NAMES = ["East", "West", "Midwest", "South"]; 

// this array is key - it ensure that winners from each round are matched
// appropriately in the subsequent round.  
var seedOrder = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15];

var regions = {}; 

// Generate an Object (regions) that contains 4 arrays (one per region)
var genRegions = function(){
	for (var i = 1; i <= REGION_NAMES.length; i++ ){
		regions["region" + i + "_" + 1] = [];
	}
};

// Generate 16 team objects per regional array.  Each has Name, Seed, & Score. 
var genSeeds = function () {
	var team = 1; 
	for (var i = 1; i <= REGION_NAMES.length; i ++) {
		for (var j = 0; j < seedOrder.length; j++) {
			regions["region" + i + "_" + 1][j] = {
				name: "team" + team++,
				seed: seedOrder[j], 
				score1: Math.random()
			} ;
		}
	}
};

// For rounds 1 - 4, within each region array, play match between team[a] and 
// team[a+1]. Winner advances to new array (eg: region1_2, region1_3...)
// Winner is also assigned a new score for the subsequent round. 

var tr, 	// tournament round (starts @ 1, increments to 4)
	result,	// builds up string to insert into HTML
	fav, 	// the "favorite" or higher seeded team in a paring 
	und, 	// the underdog of said paring
	winner,	// the team that won the match 
	id; 	// build up HTML id for injection
var playRounds = function () {
	for (tr = 1; tr <= 4; tr++ ) {
		for (var i = 1; i <= REGION_NAMES.length; i++) {
			result = "";
			for (var j = 0, x = regions["region" + i + "_" + tr]; j < x.length; j ++) {

				fav = x[j]; 
				und = x[++j];

				winner = (fav["score" + tr] > 
						(fav.seed / ( fav.seed + und.seed))) 
	          			? fav : und ;  

	          	winner["score" + (tr + 1)] = Math.random();

	          	regions["region" + i + "_" + (tr + 1)] = 
	          		regions["region" + i + "_" + (tr + 1)] || [] ; 
	          	regions["region" + i + "_" + (tr + 1)][(j - 1) / 2] = winner

	          	result += "<br />" + fav.seed + ". " + 
	                fav.name + " - " + 
	                fav["score" + tr].toFixed(3) + "<br / >" + 
	                und.seed + ". " + und.name + 
	                "<br /> <b>Winner: " + winner.seed + ". </b>" + winner.name + "<br />" ;
			}
			id = "sub_col_" + i + "_" + tr;
			document.getElementById(id).innerHTML += result;
		}
	}
};

// Take the winner from each region, and play match between region 1 vs 2, 
// and region 3 vs 4. Advance winners to "finalists" array
var playFinalFour = function () {
	tr = 5, result = ""; 

	for (var i = 1; i <= 4; i++){

		fav = regions["region" + i + "_" + tr][0];
		fav.region = REGION_NAMES[i - 1]; 
		console.log("Fav = " + fav.name + " from " + fav.region);

		i++;
		
		und = regions["region" + i + "_" + tr][0];
		und.region = REGION_NAMES[i - 1]; 
		console.log("Und = " + und.name + " from " + und.region);

		winner = (fav["score" + tr] > (fav.seed / ( fav.seed + und.seed ))) 
			? fav : und ;

		winner["score" + (tr + 1)] = Math.random();

		regions.finalists = regions.finalists || [];
		regions.finalists.push(winner);

      	result += "<br /> <b>" + fav.region + ":</b> " +
      		fav.seed + ". " + fav.name + " - " + 
            fav["score" + tr].toFixed(3) + "<br / > <b>" + 
            und.region + ":</b> " + und.seed + ". " + und.name + 
            "<br /> <b>Winner: " + winner.seed + ". </b>" + 
            winner.name + "<br />" ;
	}
	document.getElementById("final_four").innerHTML += result;
};

// Play match between Finalists.  Report out winner.  
var playChampGame = function () {
	tr = 6, result = "" ; 
	fav = regions.finalists[0];
	und = regions.finalists[1];

	winner = (fav["score" + tr] > (fav.seed / ( fav.seed + und.seed ))) 
			? fav : und ;

	result += "<br /> <b>" + fav.region + ":</b> " +
      		fav.seed + ". " + fav.name + " - " + 
            fav["score" + tr].toFixed(3) + "<br / > <b>" + 
            und.region + ":</b> " + und.seed + ". " + und.name + 
            "<br /> <b>The winner is... " + winner.name + ". </b> The " + 
            winner.seed + " seed from the " + winner.region + "!! <br />" ;

    document.getElementById("champ_game").innerHTML += result;
};
