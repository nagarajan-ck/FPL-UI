import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'fplApp';
  fplURL_table = 'https://90mmfpl.azurewebsites.net/fpl/table?leagueID=';
  fplURL_fixtures = 'https://90mmfpl.azurewebsites.net/fpl/fixtures?gameweek={gameweek}&leagueID=';
  fpl_fixtures: any;
  playerData: any[];
  mainLeagueID = "1768028";
  secondDivisionID = "1768026"
  division = "1"
  fixtures: any[]
  result : boolean= true
  completed_gameweek: number;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.callFPLService(this.mainLeagueID);
  }


  callFPLService(leagueID: string) {
    document.documentElement.scrollTop=0;
    this.division = leagueID == this.mainLeagueID ? "1" : "2";
    this.result = true


    this.http.get(this.fplURL_table + leagueID).subscribe(
      response => {
        this.playerData = response["standings"]["results"]
        this.confirmStatus();
        this.completed_gameweek = this.playerData.length == 0 ? 0 : this.playerData[0]["matches_played"];
        this.getResults();
console.log(this.playerData);

      },
      err => { console.log(err); }
    );

  }

  getFixtures() {
    let leagueID: string = this.division=="1"? this.mainLeagueID: this.secondDivisionID;
    this.result=false

    this.getGames(this.fplURL_fixtures.replace("{gameweek}", (this.completed_gameweek+39).toString()) + leagueID);

    
    // this.http.get(this.fplURL_fixtures).subscribe(
    //   response => {
    //     this.fixtures = response["results"]
    //     console.log(this.fixtures);


    //   },
    //   err => { console.log(err); }
    // );
  }

  getResults(){
    this.result = true
    let leagueID: string = this.division=="1"? this.mainLeagueID: this.secondDivisionID;
    this.getGames(this.fplURL_fixtures.replace("{gameweek}", (this.completed_gameweek+38).toString()) + leagueID);
    
  }

  getGames(fplUrl: string){
    console.log(fplUrl);
    
    // this.fplURL_fixtures = this.fplURL_fixtures.replace("{gameweek}", this.completed_gameweek.toString()) + leagueID;
    this.http.get(fplUrl).subscribe(
      response => {
        this.fixtures = response["results"]
        console.log(this.fixtures);


      },
      err => { console.log(err); }
    );

  }
  


  confirmStatus() {
    let leagueSize = this.playerData.length;

    let promotion_cuttoff = this.playerData[3]["total"];
    let relegation_cuttoff = this.playerData[leagueSize - 4]["total"];

    let matches_remaining = ((leagueSize * 2) - 2) - this.playerData[0]["matches_played"];
    for (let i = 0, j = leagueSize - 3; i < 3 && j < leagueSize; ++i, j++) {
      // console.log(matches_remaining);
      // console.log(promotion_cuttoff); console.log(relegation_cuttoff);
      if (this.division == '2') {
        if (promotion_cuttoff + (3 * matches_remaining) < this.playerData[i]["total"]) {
          this.playerData[i]["rank"] = "P"
        }
      } else {
        if (i == 0) {
          if (this.playerData[1]["total"] + (3 * matches_remaining) < this.playerData[i]["total"])
            this.playerData[i]["rank"] = "C"
        }
      }
      if (this.playerData[j]["total"] + (3 * matches_remaining) < relegation_cuttoff) {
        this.playerData[j]["rank"] = "R"
      }
    }

  }
}
