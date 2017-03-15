# ncaa-brackets

This is my first project that actually does something.  

The program will model the NCAA tournement and predict a winner of each game. 
- 64 teams are created as Objects
- They are split into 4 regions
- Within each region, teams play matches to determine who advances to the subsequent round
- To advance, the team's score (a random number between (0 - 1)) must be greater than that team's seed divided by the sum of the seeds of both teams in the match.  
  - EG1: Seed 3 vs Seed 14.  Seed 3 is assigned a score of .210 which is great than (3/(3 + 14)) = .176, so the 3 Seed wins.  
  - EG2: Seed 1 vs Seed 4.  Seed 1 is assigned a score of .150 which is less than (1 / (1 + 4)) = .200, so the 3 Seed wins.  
- This is repeated until a champion is declared. 

It's got no backend but my goals for this are to: 
- practice elementary javascript
- get something functional posted to github 
- have a project worth styling up (and learn wtf Flexbox is)

