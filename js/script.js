//read all the datasets


//read seasons dataset
// d3.csv("dataset/Season.csv", function (error, seasonData) {
d3.json("dataset/Season.json", function (error, seasonData) {

    d3.json("dataset/Player.json", function (error, playerData){

        d3.json("dataset/Team.json", function (error, teamData){

            d3.json("dataset/Player_Match.json", function (error, playerMatchData){

                d3.json("dataset/Ball_by_Ball.json", function (error, ballData){

                    d3.json("dataset/Match.json", function (error, matchData) {

                        // console.log(seasonData);
                        // console.log(playerData);
                        // console.log(ballData);

                        //for view 1: AwardStats
                        window.awardStats = new AwardStats(seasonData, playerData, teamData, matchData, ballData);
                        //populate table for the first time
                        awardStats.update(1);

                        //for view 2: MatchLocation
                        window.matchLocation = new MatchLocation(seasonData, playerData, teamData, playerMatchData, matchData);
                        matchLocation.update(1,"Mumbai");

                        //for view 3: PlayerChart
                        window.playerChart = new PlayerChart(seasonData, playerData, teamData, playerMatchData, matchData,ballData);
                        playerChart.update(1, "Delhi");
                    });


                });


            });

        });

    });
});

function chooseSeason() {
    awardStats.chooseSeason();
    matchLocation.chooseSeason();
    playerChart.chooseSeason();
}

