import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fplApp';
  fplURL = 'http://localhost:5000/fpl/minileague?leagueID=';
  fplResponse: any;
  playerData: any[];
  mainLeagueID = "1255772";
  secondDivisionID = "4114"
  division = "1"
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.callFPLService(this.mainLeagueID);
  }


  callFPLService(leagueID: string) {
    this.division = leagueID == this.mainLeagueID ? "1" : "2";



    this.fplResponse = this.http.get(this.fplURL + leagueID).subscribe(
      response => {
        this.playerData = response["standings"]["results"]
        this.confirmStatus();

      },
      err => { console.log(err); }
    );
  }


  confirmStatus() {
    let leagueSize = this.playerData.length;

    let promotion_cuttoff = this.playerData[3]["total"];
    let relegation_cuttoff = this.playerData[leagueSize-4]["total"];

    let matches_remaining = ((leagueSize * 2) - 2) - this.playerData[0]["matches_played"];
    for (let i = 0, j = leagueSize-3; i < 3 && j < leagueSize; ++i, j++) {
      // console.log(matches_remaining);
      // console.log(promotion_cuttoff); console.log(relegation_cuttoff);
      if (this.division == '2') {
        if (promotion_cuttoff + (3 * matches_remaining) < this.playerData[i]["total"]) {
          this.playerData[i]["rank"] = "P"
        }
      }else{
      if (i == 0) {
        if (this.playerData[1]["total"] + (3 * matches_remaining) < this.playerData[i]["total"])
          this.playerData[i]["rank"] = "C"
      }}
      if (this.playerData[j]["total"] + (3 * matches_remaining) < relegation_cuttoff) {
        this.playerData[j]["rank"] = "R"
      }
    }

  }
}
