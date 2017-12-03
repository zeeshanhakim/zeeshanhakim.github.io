class AwardStats {

    // var newData = [];
    constructor (seasonData,playerData,teamData, matchData, ballData) {

        let self = this;
        //the data
        this.seasonData = seasonData;
        this.playerData = playerData;
        this.teamData = teamData;
        this.matchData = matchData;
        this.ballData = ballData;
        this.newData = [];
        self.barChartData = [];


        // console.log(seasonData);
        // console.log(playerData);
        // console.log(teamData);
        // console.log(self.matchData);
        // console.log(ballData);


        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divawardStats = d3.select("#awardstats-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divawardStats.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 500;


        //set svg for chart in awardstats
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.barsvg = d3.select("#tableChartsDiv");
        // console.log(testsvg);

        this.barsvg = this.barsvg.append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.barsvg.append("g")
            .attr("class", "x_axis");
        this.barsvg.append("g")
            .attr("class", "y_axis");



        //add the svg to the div
        // this.svg = divawardStats.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight)
        console.log(this.seasonData);
        console.log(this.playerData);
        console.log(self.matchData);


        //filter to combine the data from both files
        // let newData = [];
        let hostcountriesList = [
            {'Season_Id':1,'Host': "India"},
            {'Season_Id':2,'Host': "Sounth Africa"},
            {'Season_Id':3,'Host': "India"},
            {'Season_Id':4,'Host': "India"},
            {'Season_Id':5,'Host': "India"},
            {'Season_Id':6,'Host': "India"},
            {'Season_Id':7,'Host': "India and U.A.E"},
            {'Season_Id':8,'Host': "India"},
            {'Season_Id':9,'Host': "India"}
        ];

        let winnerList = [
            {'Season_Id':1,'winner': "Rajasthan Royals"},
            {'Season_Id':2,'winner': "Deccan Chargers"},
            {'Season_Id':3,'winner': "Chennai Super Kings"},
            {'Season_Id':4,'winner': "Chennai Super Kings"},
            {'Season_Id':5,'winner': "Kolkata Knight Riders"},
            {'Season_Id':6,'winner': "Mumbai Indians"},
            {'Season_Id':7,'winner': "Kolkata Knight Riders"},
            {'Season_Id':8,'winner': "Mumbai Indians"},
            {'Season_Id':9,'winner': "Sunrisers Hyderabad"}
        ];
        self.seasonData.map(function (d) {
            let orangeCapName = '';
            let purpleCapName = '';
            let manOfTheSeries = '';
            let numberOfMatches = '';
            let hostCountry = '';
            //filtering for values
            let orangeCupData = self.playerData.filter(function (d2) {

                return d2.Player_Id === d.Orange_Cap_Id
            });
            let purpleCupData = self.playerData.filter(function (d2) {

                return d2.Player_Id === d.Purple_Cap_Id
            });

            let manOfTheSeriesData = self.playerData.filter(function (d2) {

                return d2.Player_Id === d.Man_of_the_Series_Id
            });

            let eachSeasonMatchesData = self.matchData.filter(function (d3) {
                return d3.Season_Id === d.Season_Id
            });
            let hostData = hostcountriesList.filter(function (d3) {

                return d3.Season_Id === d.Season_Id
            });

            // console.log(eachSeasonMatchesData);
            // console.log(eachSeasonMatchesData.length);
            //creating new data
            // console.log(purpleCupData);
            // console.log(hostcountriesList);
            orangeCupData.map(function (eachRecord) {

                orangeCapName = eachRecord.Player_Name;
            });

            purpleCupData.map(function (eachRecord) {

                purpleCapName = eachRecord.Player_Name;
            });

            manOfTheSeriesData.map(function (eachRecord) {

               manOfTheSeries = eachRecord.Player_Name;
            });

            hostData.map(function (eachRecord) {

                hostCountry = eachRecord.Host
            });
            let winnerOfSeason = '';
            winnerList.map(function (d1) {
                if (d1.Season_Id === d.Season_Id)
                    winnerOfSeason = d1.winner
            });


            let winArray = [];
            let momArray = [];
            let tossWinArray = [];
            let matchID = [];
            eachSeasonMatchesData.map(function (d) {
                winArray.push(d.Match_Winner_Id);
                momArray.push(d.Man_Of_The_Match_Id);
                tossWinArray.push(d.Toss_Winner_Id);
                matchID.push(d.Match_Id);
            });

            // console.log(winArray);

            function mode(array)
            {
                let modeMap = {};
                let maxEl = array[0], maxCount = 1;
                for(let i = 0; i < array.length; i++)
                {
                    // console.log("test");
                    // console.log(array[i]);
                    let el = parseInt(array[i]);
                    if(!modeMap[el])
                        modeMap[el] = 1;
                    else
                        modeMap[el]++;
                    if(modeMap[el] > maxCount)
                    {
                        // console.log(el);
                        maxEl = el;
                        maxCount = modeMap[el];
                    }
                }
                // console.log(modeMap);
                return maxEl;
            }

            //win max will give team ID
            let winMax = mode(winArray);
            let winTeamName = "";
            // console.log(winMax);
            self.teamData.map(function (d) {
               if(d.Team_Id === winMax)
                   winTeamName = d.Team_Name
            });
            // console.log(winTeamName);

            //mom Max gives player ID
            let momMax = mode(momArray);
            let momMaxName = '';
            // console.log(momMax);
            self.playerData.map(function (d) {
               if(d.Player_Id === momMax)
                   momMaxName = d.Player_Name
            });

            //tossWin Max gives team ID
            let tossWinMax = mode(tossWinArray);
            let tossWinTeamName = '';
            // console.log(tossWinMax);
            self.teamData.map(function (d) {
                if(d.Team_Id === tossWinMax)
                    tossWinTeamName = d.Team_Name
            });

            //get 6's and 4's and extras if possible
            // console.log(matchID);
            // let ballSeasonData = self.ballData.filter;
            let noOfSixes = 0;
            let noOfFours = 0;
            let noDotBalls = 0;
            let wickets = 0;
            let extras = 0;
            let playersDismissed = [];
            matchID.map(function (d1) {



                // console.log(d1);
                let eachMatchData = self.ballData.filter(function (d2) {
                    // console.log(d2.Match_Id);
                    // console.log(d1);
                    return d2.Match_Id === d1
                });
                // console.log(eachMatchData)
                eachMatchData.map(function (d3) {
                    if(d3.Batsman_Scored === 6)
                    {
                        noOfSixes++;
                    }
                    else if(d3.Batsman_Scored === 4)
                    {
                        noOfFours++;
                    }
                    else if(d3.Batsman_Scored === 0)
                    {
                        noDotBalls++;
                    }

                    if(d3.Player_dissimal_Id !== null)
                    {
                        if (!playersDismissed.includes(d3.Player_dissimal_Id))
                            playersDismissed.push(d3.Player_dissimal_Id);


                    }
                    if(d3.Extra_Runs !== '')
                    {
                        // console.log(extras);
                        // console.log(d3.Extra_Runs);
                        extras = parseInt(extras) + parseInt(d3.Extra_Runs)
                    }

                });
                // console.log(noOfSixes);
                // console.log(noOfFours);
                // console.log(noDotBalls);
                // console.log(playersDismissed.length);
                // console.log(extras);

            });
            // console.log(noOfSixes);
            // console.log(noOfFours);
            // console.log(noDotBalls);
            // console.log(playersDismissed.length);
            // console.log(extras);


            numberOfMatches = eachSeasonMatchesData.length;
            self.newData.push({
                'seasonID':d.Season_Id,
                'seasonYear':d.Season_Year,
                'orangeCap':orangeCapName,
                'purpleCap':purpleCapName,
                'manOfTheSeries': manOfTheSeries,
                'momMax': momMaxName,
                'winner': winnerOfSeason,
                'numberOfMatches': numberOfMatches,
                'hostCountry': hostCountry,
                'mostWins': winTeamName,
                'tossWinMax': tossWinTeamName,
                'noOfSixes': noOfSixes,
                'noOfFours': noOfFours,
                'noDotBalls': noDotBalls,
                'playersDismissed': playersDismissed.length,
                'extras': extras
            });

            // return console.log(newData)

            //data for chart
            // console.log(eachSeasonMatchesData);

            self.teamData.map(function (d2) {

                // let teamMatchesData = eachSeasonMatchesData.filter(function (d3) {
                //     return d2.Team_Id === d3.Match_Winner_Id
                // });
                let wins = 0;
                let losses = 0;
                let draw = 0;
                eachSeasonMatchesData.map(function (d3) {
                    if(d2.Team_Id === d3.Team_Name_Id || d2.Team_Id === d3.Opponent_Team_Id)
                    {
                        if(d3.IS_Result === 1)
                        {
                            if(d2.Team_Id === d3.Match_Winner_Id)
                            {
                                wins++;
                            }
                            else
                                losses++;
                        }
                        else
                            draw++;
                    }
                });
                self.barChartData.push({
                    seasonID:d.Season_Id,
                    teamName: d2.Team_Short_Code,
                    wins: wins,
                    losses: losses,
                    draw: draw
                });
                // console.log(wins);
                // console.log(losses);
                // console.log(draw);

            });
            // console.log(self.barChartData);

        });


        // console.log(self.newData);
        // this.createTable(self.newData);
    };

    update (seasonNo) {

        // console.log(this.newData);
        // console.log(this.barChartData);
        this.createTable(this.newData,seasonNo);
        this.genBarchart(this.barChartData,seasonNo);


    };

    createTable(data,seasonNo){
        // console.log(seasonNo);



        let tableHeaders = ["-","Season", "Year", "Orange Cap", "Purple Cap", "Man of the Series", "Most Man of the Matches","Season Winner",
            "Number of Matches", "Host Country", "Most Wins","Most Toss Wins", "Number of 6's", "Number of 4's", "Total Dot Balls", "Wickets taken", "Total Extras"];
        let table = d3.select("#tableStats").append("table").attr("id",'table');
        // console.log(data);
        // let caption = table.append("caption").text("Table");
        // console.log(caption);
        let runData = data.filter(function (d) {
            // console.log(d);
           return  d.seasonID === parseInt(seasonNo)
        });
        // console.log(runData);
        let thead = table.append("thead");
        let tbody = table.append("tbody");

        //headers data binding
            let headSel = thead.append('tr')
                .selectAll('th')
                .data(tableHeaders);

            //exit condition
            headSel.exit().remove();

            //entry  and merge condition
            headSel = headSel.enter().append("th").merge(headSel);

            //attribs
            headSel.text(function (d) { return d });

        //rows data binding
        let rows = tbody.selectAll('tr')
            .data(runData);

        //exit condition
        rows.exit().remove();

        //entry and merge conditions
        let rowsenter = rows.enter().append('tr');
        rows = rows.merge(rowsenter);

        //data binding
        let cells = rows.selectAll("td")

            .data(function (d) {
                // console.log(d[0]);
                return [ d["-"],
                    d["seasonID"], d["seasonYear"], d["orangeCap"], d["purpleCap"], d["manOfTheSeries"], d["momMax"],d["winner"],
                    d["numberOfMatches"], d["hostCountry"], d["mostWins"], d["tossWinMax"] ,d["noOfSixes"],
                    d["noOfFours"], d["noDotBalls"], d["playersDismissed"], d["extras"]]
            });

        //exit condition
        cells.exit().remove();

        //entry and update condition
        cells = cells.enter().append('td').merge(cells);

        cells.text(function (d) { return d });

        let myTable = document.getElementById('table');
        // console.log(myTable);


        let newTable = document.getElementById('newTable');

        let caption = newTable.createCaption();
        caption.innerHTML = "<b>Award Staticstics of each season</b>";
        // console.log(newTable);
        let maxColumns = 0;
        // Find the max number of columns
        for(let r = 0; r < myTable.rows.length; r++) {
            if(myTable.rows[r].cells.length > maxColumns) {
                maxColumns = myTable.rows[r].cells.length;
            }
        }

        //add header for the table
        // let header = newTable.createTHead();

        // newTable.in
        let headRow = newTable.insertRow(0);
        let headCell1 = headRow.insertCell(0);
        let headCell2 = headRow.insertCell(1);
        headCell1.innerHTML = "<b>Award Statistics</b>";
        headCell2.innerHTML = "<b>Value</b>";



        for(let c = 1; c < maxColumns; c++)
        {
            let t = newTable.insertRow();
            // t;
            if(c === 3 || c === 4 || c === 5 || c === 6)
            {
                // console.log("check");
                t.id = "row_no"+c
            }

            for(let r = 0; r < myTable.rows.length; r++) {
                if(myTable.rows[r].length <= c) {
                    newTable.rows[c].insertCell(r);
                    newTable.rows[c].cells[r] = '-';
                }
                else {
                    newTable.rows[c].insertCell(r);
                    newTable.rows[c].cells[r].innerHTML = myTable.rows[r].cells[c].innerHTML;
                }
            }
        }
        let div = document.getElementById('tableStats');

        div.appendChild(newTable);

        //removes the horizontal table
        myTable.parentNode.removeChild(myTable);

        //display text for orange cap
        let orangeCapName = document.getElementById("row_no3").cells[1].innerHTML;
        // console.log(orangeCapName);
        let oCData = this.playerData.filter(function (d) {
           return d.Player_Name === orangeCapName
        });
        // console.log(oCData);

        let orangeTitle = "Batting Hand: " + oCData[0].Batting_Hand +"          "+ "Bowling Skill: " + oCData[0].Bowling_Skill +"         " +"Country: "+ oCData[0].Country;
        document.getElementById('row_no3').setAttribute('title', orangeTitle);
        document.getElementById("row_no3").onmouseover = function() {
            // console.log(this.cells[1].innerHTML);
        };

        //display text for purple cap
        let purpleCapName = document.getElementById("row_no4").cells[1].innerHTML;
        // console.log(purpleCapName);
        let pCData = this.playerData.filter(function (d) {
            return d.Player_Name === purpleCapName
        });
        // console.log(pCData);
        let purpleTitle = "Batting Hand: " + pCData[0].Batting_Hand +"          "+ "Bowling Skill: " + pCData[0].Bowling_Skill +"         " +"Country: "+ pCData[0].Country;
        document.getElementById('row_no4').setAttribute('title', purpleTitle);
        document.getElementById("row_no4").onmouseover = function() {
            // console.log(this.cells[1].innerHTML);
        };

        //display for man of the series

        let manOftheSeriesName = document.getElementById("row_no5").cells[1].innerHTML;
        let motSeriesData = this.playerData.filter(function (d) {
            return d.Player_Name === manOftheSeriesName
        });
        let manOfTheSeriesTitle = "Batting Hand: " + motSeriesData[0].Batting_Hand +"          "+ "Bowling Skill: " + motSeriesData[0].Bowling_Skill +"         " +"Country: "+ motSeriesData[0].Country;
        document.getElementById('row_no5').setAttribute('title', manOfTheSeriesTitle);
        document.getElementById("row_no5").onmouseover = function() {
            // console.log(this.cells[1].innerHTML);
        };

        //display for most man of the matches

        let momName = document.getElementById("row_no6").cells[1].innerHTML;
        let momData = this.playerData.filter(function (d) {
            return d.Player_Name === momName
        });
        let momTitle = "Batting Hand: " + momData[0].Batting_Hand +"          "+ "Bowling Skill: " + momData[0].Bowling_Skill +"         " +"Country: "+ momData[0].Country;
        document.getElementById('row_no6').setAttribute('title', momTitle);
        document.getElementById("row_no6").onmouseover = function() {
            // console.log(this.cells[1].innerHTML);
        };


    }

    genBarchart(data,seasonNo){
        let self = this;

        //check data incoming
        // console.log(data);
        // console.log(seasonNo);
        //svg check
        // console.log(this.barsvg)

        let barData = data.filter(function (d) {
            // console.log(d);
            return  d.seasonID === parseInt(seasonNo)
        });
        console.log(barData);

        let stack = d3.stack()
            .keys(["wins", "losses", "draw"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        let series = stack(barData);
        // console.log(series);
        // series.map(function (d,i) {
        //    console.log(d[i].data.teamName);
        // });
        // console.log(barData);
        // barData.map(function (d) {
        //    console.log(d.teamName)
        // });

        // console.log(barData.map(function (d) {
        //     return d.teamName
        // }));

        let xScale = d3.scaleBand()
            .domain(barData.map(function (d) {
                return d.teamName
            }))
            .range([0, self.width-60])
            .padding(0.08);
        // console.log(xScale('DD'));

        let y1Max = d3.max(series, function(y) { return d3.max(y, function(d) { return d[1]; }); });
        console.log(y1Max);
        if(y1Max % 2 === 1)
        {
            y1Max = y1Max+1
        }
        let yScale = d3.scaleLinear()
            .domain([0, y1Max])
            .range([self.height, 0]);

        //color
        let t = d3.transition()
            .duration(1000);

        let colorScale = d3.scaleOrdinal()
            .domain(d3.range(3))
            .range(d3.schemeCategory20c);

        let colorsAW = ["#854442","#BE9B7B","#3C2F2F"];

        //axis
        let xAxis = d3.axisBottom()
            .scale(xScale);

        let yAxis = d3.axisLeft()
            .scale(yScale);


        // console.log(this.barsvg.select("x_axis"));
        d3.select(".x_axis")
            .attr("transform", "translate(0," + self.height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(0)")
            .attr("transform", "translate(20,12)" );

        d3.select(".y_axis")
            // .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");
            // .text("Value ($)");
        // this.barsvg.append("g").attr("class","bars");
        //
        // let bars = d3.select("#bars").selectAll("rect").data(series);
        let groups = this.barsvg.selectAll("g.cost")
            .data(series);
        groups = groups.enter().append("g").merge(groups);
        groups.exit().remove();
        groups.attr("class", "cost")
            .style("fill", function(d, i) { return colorsAW[i]; });

        let rect = groups.selectAll("rect").data(function(d) { return d; });
        rect = rect.enter()
            .append("rect").merge(rect);
        rect.attr("x", function(d, i) {
                // console.log(d.data.teamName);
                return xScale(d.data.teamName)
                // console.log(d[i]);
                })
            .attr("y", function(d) { return yScale(d[1]); })
            .transition(t)
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width", xScale.bandwidth());

            rect.on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                let xPosition = d3.mouse(this)[0] - 15;
                let yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(d[1]-d[0]);});


        // console.log(this.barsvg);
        //add legend to the graph
        let legend = this.barsvg.selectAll(".legendAW")
            .data(colorsAW)
            .enter().append("g")
            .attr("class", "legendAW")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        legend.append("rect")
            .attr("x", this.width - 70)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colorsAW.slice().reverse()[i];});

        legend.append("text")
            .attr("x", this.width-40)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) {
                switch (i) {
                    case 0: return "Tie";
                    case 1: return "Losses";
                    case 2: return "Wins";
                }
            });


        //tooltips
        let tooltip = this.barsvg.append("g")
            .attr("class", "tooltipAS")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
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
        //removing old table
        let myNode = document.getElementById('newTable');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        this.update(d3.select('#season-select').node().value);


    }

};