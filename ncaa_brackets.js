// High level: there are 2 main ways to manage state in a program: functional and
// imperative. This program is kind of using concepts from both, which results in
// code that is harder to reason about. Here's the rough breakdown:
//
// Functional Programming
// ----------------------
// Instances of objects are never changed. You have a `regions` object that you are
// changing throughout the program. In a functional world, your code might look like:
// 
//     var regions = initRegions();
//
//     $('.playRoundsBtn').click(function() {
//         regions = playRounds(regions);
//     });
//
//
//     $('.playFinalFourBtn').click(function() {
//         regions = playFinalFour(regions);
//     });
//
// Notice that instead of modifying regions directly, our functions are taking the
// current regions, modifying them in some black box, and returning _new_ regions
// with additional information. Without going into too much detail, the main benefit
// here is code that's easier to reason about in chunks, since each function is a
// black box that takes inputs and spits out outputs. You can now focus on the
// behavior of each function individually without worrying about variables in the
// rest of your program.
//
// Imperative Programming
// ----------------------
// Instances of objects _are_ changed. This is what you are doing with your `regions`
// object. As the program progresses, the single `regions` variable defined at the
// top is changed. This means that as you are writing code, you have to be aware of
// the global `regions` variable and how other functions might be modifying it.
//
// This type of program is better suited to an object-oriented approach. With your
// program, you might do something like:
//
//     function Bracket(regions) {
//         this.regions = regions;
//
//         this.playRounds = function(roundNumber) { ... plays all the rounds ... };
//         this.playRound = function(roundNumber) { ... plays a single round ... };
//         this.draw = function() { ...keep all the html drawing here... };
//     }
//
//     function Region(name, teams) {
//         this.name = name;
//         this.teams = teams;
//
//         this.draw = function() { ...keep all the html drawing here... };
//     }
//
//     function Match(team1, team2) {
//         this.team1 = team1;
//         this.team2 = team2;
//
//         this.play = function(team1, team2) { ...do stuff and return winning team... };
//         this.draw = function() { ...keep all the html drawing here... };
//     }
//
//     var regions = [];
//     for (var i; i = 0; i < REGION_NAMES.length) {
//         regions.push(new Region(REGION_NAMES[i]));
//     }
//
//     var bracket = new Bracket(regions);
//
//     function playRounds() {
//         // this is the function bound to your button
//         bracket.playRounds();
//     }
//
// Super rough, but the key difference from your existing program is that instead of
// focusing everything around individual _functions_, you're focusing everything
// around _classes_. This is easier to reason about because you have objects that
// map to real world concepts. Your code reads much like you would describe the
// events to a human being.
//
// This version of the bracket program has global state and functions that modify it,
// so it is kind of a hybrid method. In this small example that's not the end of the
// world, but at any sort of scale that becomes very hard to reason about.


// Pretty sure `const` is ES2015 only. Might want `var` here.
const REGION_NAMES = ["East", "West", "Midwest", "South"]; 

// this array is key - it ensure that winners from each round are matched
// appropriately in the subsequent round.  
var seedOrder = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15];

var regions = {}; 

// Generate an Object (regions) that contains 4 arrays (one per region)
// I don't think you technically need a button to run this code, right?
// You could populate the regions when the script is first loaded?
var genRegions = function(){
	for (var i = 1; i <= REGION_NAMES.length; i++ ){
		// See the "High Level" comment at the top, but also, might it be easier
		// to have regions be an array of arrays? Or an object of objects? You
		// could avoid all the messy string building and access it like `regions[i][0]`.
		regions["region" + i + "_" + 1] = [];
	}
};

// Generate 16 team objects per regional array.  Each has Name, Seed, & Score. 
// I don't think you technically need a button here either, unless I'm
// misunderstanding the need for the score below. It seems like this code will
// always run exactly the same, and is more initialization of state rather than
// something that needs to be re-usable. It is nice to compartmentalize this logic
// in a function but you could remove 2 buttons and just do:
// 
//     initRegions() {
//         var regions = {};
//         // init `regions` object and seed data
//         return regions;
//     }
//
//     var regions = initRegions();
var genSeeds = function () {
	var team = 1; 
	for (var i = 1; i <= REGION_NAMES.length; i ++) {
		for (var j = 0; j < seedOrder.length; j++) {
			regions["region" + i + "_" + 1][j] = {
				name: "team" + team++,
				seed: seedOrder[j], 
				score1: Math.random() // I'm a little confused why a score is generated here? Shouldn't scores be generated when playing the rounds?
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

	          	// You could make this function easier to understand by abstracting away
	          	// view-generation code into its own function. The current wall of code is
	          	// a bit daunting to approach.
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
