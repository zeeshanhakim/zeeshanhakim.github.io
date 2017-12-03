class PlayerChart {


    constructor (seasonData,playerData,teamData,playerMatchData,matchData,ballData) {


        //the data
        this.seasonData = seasonData;
        this.playerData = playerData;
        this.teamData = teamData;
        this.playerMatchData = playerMatchData;
        this.matchData = matchData;
        this.ballData = ballData;
        // console.log(seasonData);
        // console.log(playerData);
        // console.log(teamData);
        // console.log(playerMatchData);
        //console.log(matchData);
        console.log(ballData);

        this.margin = {top: 10, right: 20, bottom: 27, left: 70};
        //set svg for chart in awardstats
        this.width = 700 - this.margin.left - this.margin.right;
        this.height = 407 - this.margin.top - this.margin.bottom;

        this.barsvg = d3.select("#bar-chartHB");
        // console.log(testsvg);

        this.barsvg = this.barsvg.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 100 + "," + this.margin.top + ")");

        this.barsvg.append("g")
            .attr("class", "x_axisHB");
        this.barsvg.append("g")
            .attr("class", "y_axisHB");

        //select heatMap div
        this.heatMapSvg = d3.select("#attr");

        this.heatMapSvg = this.barsvg.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");




    };



    update (seasonNo,city) {
        //var data = [4, 8, 15, 16, 23, 10];
        let self = this;
        // console.log(this.matchData);
        let season_filter_data = this.matchData.filter(function(d) {
        //            console.log(d);
            return d.Season_Id == seasonNo;
        });

        // console.log(season_filter_data);
        //GET ALL THE MATCHES of that SEASON to get the Players' Data from Player_Match
        let match_id_array = [];
        d3.map(season_filter_data, function (d) {
            match_id_array.push(d.Match_Id);
        });
        // console.log(match_id_array);

        let player_match_filter_data = this.playerMatchData.filter(function(d) {
            //            console.log(d);
            return (match_id_array.includes(d.Match_Id));
        });

        //console.log(player_match_filter_data);
        //THIS array contains all the player IDs for that participated in a season.
        let distinct_player_ids = [];
        d3.map(player_match_filter_data, function(d) {
            if (!(distinct_player_ids.includes(d.Player_Id))) {
                distinct_player_ids.push(d.Player_Id);
            }
        });
        //console.log(distinct_player_ids);
        var PlayerCountriesHashMap = {};
        // console.log(this.playerData);
        d3.map(this.playerData, function (d) {
            if (!PlayerCountriesHashMap[d.Country]) {
                PlayerCountriesHashMap[d.Country] = 0;
            }
            if(distinct_player_ids.includes(d.Player_Id)){
                PlayerCountriesHashMap[d.Country] = parseInt(PlayerCountriesHashMap[d.Country]) + 1;
            }
            //console.log(d.City_Name)
        });
        // console.log(PlayerCountriesHashMap);




        let Country = [];
        let PlayerCount = [];
        this.playerCount = [];
        for(let key in PlayerCountriesHashMap) {


            if(!(key === 'India'))
            {

            Country.push(key);
            PlayerCount.push(parseInt(PlayerCountriesHashMap[key]));

            self.playerCount.push({
                'countryName':key,
                'playerCount':PlayerCountriesHashMap[key]

            })
            }

        }
        // console.log(Country);
        // console.log(PlayerCount);
        // console.log(self.playerCount);

        // console.log(self.playerCount);
        this.genBarChart(self.playerCount);
        this.heatMapData = [];
        for (let season = 1; season < 10; season++ ) {
            let season_filter_data2 = this.matchData.filter(function(d) {
                //            console.log(d);
                return d.Season_Id === season;
            });

            //console.log(season_filter_data);
            //GET ALL THE MATCHES of that SEASON to get the Players' Data from Player_Match
            let match_id_array2 = [];
            d3.map(season_filter_data2, function (d) {
                match_id_array2.push(d.Match_Id);
            });
            //console.log(match_id_array);

            let player_match_filter_data2 = this.playerMatchData.filter(function(d) {
                //            console.log(d);
                return (match_id_array2.includes(d.Match_Id));
            });

            //console.log(player_match_filter_data);
            //THIS array contains all the player IDs for that participated in a season.
            let distinct_player_ids2 = [];
            d3.map(player_match_filter_data2, function(d) {
                if (!(distinct_player_ids2.includes(d.Player_Id))) {
                    distinct_player_ids2.push(d.Player_Id);
                }
            });
            //console.log(distinct_player_ids);
            let PlayerCountriesHashMap2 = {};
            d3.map(this.playerData, function (d) {
                if (!PlayerCountriesHashMap2[d.Country]) {
                    PlayerCountriesHashMap2[d.Country] = 0;
                }
                if(distinct_player_ids2.includes(d.Player_Id)){
                    PlayerCountriesHashMap2[d.Country] = parseInt(PlayerCountriesHashMap2[d.Country]) + 1;
                }
                //console.log(d.City_Name)
            });

            Country.map(function (d) {
                // console.log("Season:" + season +" " +d+ " " + PlayerCountriesHashMap2[d]);
                self.heatMapData.push(
                    {
                        season: season,
                        cName:  d,
                        pCount: PlayerCountriesHashMap[d]
                    }
                )


            });
            //PlayerCountriesHashMap2 = null;
            // console.log(this.heatMapData);
            // this.genHeatMap(self.heatMapData)

        }


    };
    genHeatMap(data)
    {
        console.log(data);

        let svg = d3.select("#heatMap");

        //testing for heatmap
        let seasons = [];
        data.map(function (d) {
           seasons.push(d.season)
        });
        let countrynames = [];
        data.map(function (d) {
           countrynames.push(d.cName)
        });
        let gridSize = Math.floor(width / 24);

        let buckets = 9;
        let colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
        let margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 60
        };
        svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let width = 700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        //scales

        console.log(width);
        let y = d3.scaleLinear()
            .range([0, width])
            .domain([1,9]);

        let x = d3.scaleBand()
            .range([height, 0], .1)
            .domain(data.map(function (d) {
                return d.cName;
            }));

        var dayLabels = svg.selectAll(".dayLabel")
            .data(seasons)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var timeLabels = svg.selectAll(".timeLabel")
            .data(countrynames)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        //color scale

        let colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) { return d.pCount; })])
            .range(colors);

        var cards = svg.selectAll(".hour")
            .data(data, function(d) {return d.season+':'+d.cName;});

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", function(d) { return (y(d.season) - 1) * gridSize; })
            .attr("y", function(d) { return (x(d.cName) - 1) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        cards.transition().duration(1000)
            .style("fill", function(d) { return colorScale(d.pCount); });

        cards.select("title").text(function(d) { return d.pCount; });

        cards.exit().remove();




    }

    genBarChart(data)
    {
        // console.log(data);

        let svg = d3.select("#bar-chartHB");
        let margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 80
        };
        svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let width = 700 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        //scales

        // console.log(width);
        let x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.playerCount+5;
            })]);

        let y = d3.scaleBand()
            .range([height, 0], .1)
            .domain(data.map(function (d) {
                return d.countryName;
            }));
        let t = d3.transition()
            .duration(1000);


        let colorScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.playerCount;
            })])
            .range(["#BE9B7B","#854442","#3C2F2F"]);

        //create the axes
        let xAxis = d3.axisBottom().scale(x);
        let yAxis = d3.axisLeft()
            .scale(y);
            //no tick marks

        d3.select(".x_axisHB")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(0)")
            .attr("transform", "translate(12,12)" );

        d3.select(".y_axisHB")
        // .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        // Create the bars
        let bars = this.barsvg.selectAll("rect").data(data);
        bars = bars.enter()
            .append('rect')
            .merge(bars);


        bars.exit().remove();
        bars
            .attr('x', 1)

            .attr('y', function (d) {
                return y(d.countryName);
            }).transition(t)
            .attr('width', function (d) {
                // console.log(d.playerCount);
                // console.log(xScale(d.playerCount));
                return x(d.playerCount);

            })
            .attr('height', y.bandwidth()-2)
            .attr('fill', function (d) {
                return colorScale(d.playerCount);

            });
            bars.on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                let xPosition = d3.mouse(this)[0] - 15;
                let yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d.playerCount);});

        let tooltip = this.barsvg.append("g")
            .attr("class", "tooltipPC")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "grey")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");


    }


    chooseSeason() {

        // console.log(d3.select('#season-select').node().value);
        //call update function using season number
        this.update(d3.select('#season-select').node().value)

    }

};