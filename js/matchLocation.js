class MatchLocation {


    constructor (seasonData,playerData,teamData,playerMatchData, matchData) {

        //the data
        this.seasonData = seasonData;
        this.playerData = playerData;
        this.teamData = teamData;
        this.playerMatchData = playerMatchData;
        this.matchData = matchData;

    };




    update (seasonNo,city) {
        var self = this;
        let season_filter_data = this.matchData.filter(function(d) {
            //            console.log(d);
            return d.Season_Id == seasonNo;
        });

        //console.log(season_filter_data);
        var MatchesHeldHashMap = {};
        d3.map(season_filter_data, function (d) {
            if (!MatchesHeldHashMap[d.City_Name]) {
                MatchesHeldHashMap[d.City_Name] = 0;
            }
            MatchesHeldHashMap[d.City_Name] = parseInt(MatchesHeldHashMap[d.City_Name]) + 1;
            //console.log(d.City_Name)

        });

        var city_names = [];

        var matches_played = [];
        for(var key in MatchesHeldHashMap) {
            //console.log(key);
            city_names.push(key);
            matches_played.push(parseInt(MatchesHeldHashMap[key]));
        }
        console.log(city_names);
        google.charts.load('current', {
            'packages': ['geochart'],
            // Note: you will need to get a mapsApiKey for your project.
            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
            'mapsApiKey': 'AIzaSyA6iexw7GgsN68JopjH9y4WTggb0tOhPpE'
        });
        google.charts.setOnLoadCallback(drawMarkersMap);
        function drawMarkersMap() {

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'City');
            data.addColumn('number', 'Matches Played');
            var i = 0;
            var rows = [];
            var max_matches = Math.max(matches_played);
            for (var city in city_names) {
                var row_entry = [];
                row_entry.push(city_names[i]);
                row_entry.push(matches_played[i]);
                rows.push(row_entry);
                i++;
            }
            data.addRows(rows);
            var options = {
                sizeAxis: { minValue: 0, maxValue: parseInt(matches_played) *4},
                region: 'IN',
                resolution: 'provinces',
                displayMode: 'markers',
                colorAxis: {colors: ['#FFFAFA', '#F4C2C2', '#FF6961', '#A40000', '#800000']},

            };

            var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
            chart.draw(data, options);

            google.visualization.events.addListener(chart, 'select', function() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var city = data.getValue(selectedItem.row, 0);
                  //  console.log(city);

                    self.update(seasonNo,city);
                }
            });

        }
        let season_city_filter_data = this.matchData.filter(function(d) {
            //            console.log(d);
            return (d.Season_Id == seasonNo && d.City_Name == city);
        });


        d3.select("#CityName").text("City Name: "+ city);
        d3.select("#Team1_2").selectAll(".team_label").remove();

        //Create a list item for each participating team
        var team_names_array = [];
        let team_data = this.teamData.map(function(d) {
            team_names_array.push(d.Team_Short_Code);
        });
        let team_text = d3.select("#Team1_2").selectAll(".team_label")
            .data(season_city_filter_data);
        team_text
            .enter().append("li")
            .text(function (d) {
                //console.log(d);
                var team_label2 = team_names_array[parseInt(d.Team_Name_Id)] + " vs " + team_names_array[parseInt(d.Opponent_Team_Id)];
                //console.log(d);
                //console.log(team_label2);
                return team_label2;
            })
            .classed("team_label", true);

        let t = d3.transition()
            .duration(3000);

        let span_select = d3.select("#Team1_2").selectAll("li");
       // console.log(span_select);
        span_select
            .data(season_city_filter_data)
            .append("ul")
            .text(function (d){
               // console.log(d);
                return "Winning Team: " + team_names_array[parseInt(d.Match_Winner_Id)];
            });
        span_select
            .append("ul")
            .text(function (d){
                // console.log(d);
                return "Date: " + d.Match_Date;
            });
       span_select
           .append("ul")
           .text(function (d){
               // console.log(d);
               return "Won " + d.Win_Type + ": " + d.Won_By;
           })
           .transition(t);

    };

    chooseSeason() {
        this.update(d3.select('#season-select').node().value)

    }

};