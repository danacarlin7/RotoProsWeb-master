import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {PlayerGetService} from '../../services/fetchPlayers';
import {CompGetService} from '../../services/fetchCompositions';
import {LineupPostService} from '../../services/postLineups';
import {AuthService} from '../../../shared/services/auth.service';

// import * as $ from 'jquery';

@Component({
  selector: 'provider-public-root',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
  providers: [PlayerGetService, CompGetService, LineupPostService, AuthService]
})
export class ProviderPublicComponent {
  operators = ['DraftKings', 'FanDuel'];
  sports = ['MLB', 'PGA'];

  currentOperator = 'DraftKings';
  currentSport = 'MLB';
  currentSlate = '';
  currentSlateID = 0;

  slates = [];
  players = [];
  fixtures = [];

  comps = {};

  playerScores = {};

  userName = "";
  userRole = "";
  userData = null;

  allLineupsWithHiding = [];
  currentDateStr = '';
  currentDate = null;

  currentFilter = 1;

  constructor(private authService:AuthService, private router:Router, private pgs:PlayerGetService, private cgs:CompGetService, private lps:LineupPostService) {
    this.authService.retrieveLoggedUserInfo()
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.userData = response.data;
       			this.userName = this.userData.first_name + " " + this.userData.last_name;
          }
          else {

          }
        },
        error => {
          console.log("http error => ", error);
        }
    );
    this.authService.loggedUserChangeEvent.subscribe(
      user => { this.userData = user; this.userName = this.userData.first_name + " " + this.userData.last_name; }
    );
    this.userRole = this.authService.getUserRole();

    this.currentDate = new Date();
    var date = this.currentDate.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/");
    this.currentDateStr = date.substring(5) + "/" + date.substring(0, 4);

    this.pgs.getSlates(this.currentOperator, this.currentSport)
      .subscribe(result => {
        this.slates = this.deDuplicateSlates(result.json()['data']);
        if (this.currentSlate == '') this.setSlate(this.slates[0].SlateID + "--" + this.slates[0].Slate);

        this.getDataForLineups();
      });
  }

  showSlatesForOperator = (operator) => {
    this.currentOperator = operator;
    this.currentSlate = '';
    this.currentSlateID = 0;
    this.showSlates();
  }
  showSlatesForSport = (sport) => {
    this.currentSport = sport;
    this.currentSlate = '';
    this.currentSlateID = 0;
    this.showSlates();
  }
  showSlates = () => {
    this.pgs.getSlates(this.currentOperator, this.currentSport)
      .subscribe(result => {
        this.slates = this.deDuplicateSlates(result.json()['data']);
        if (this.currentSlate == '') this.setSlate(this.slates[0].SlateID + "--" + this.slates[0].Slate);

        this.getDataForLineups();
      });
  }
  deDuplicateSlates = (slateData) => {
    var slateMap = {};
    for (var i in slateData) {
	    slateMap[slateData[i].Slate] = slateData[i];
  	}

  	var slates = [];
  	for (var key in slateMap) {
  	  slates.push(slateMap[key]);
  	}
  	return slates;
  }
  setSlate = (slate) => {
    this.currentSlateID = parseInt(slate.split("--")[0]);
    this.currentSlate = slate.split("--")[1];
  }
  getScores = () => {
    this.playerScores = {};
    this.pgs.getScores(this.currentOperator, this.currentSport, this.currentSlateID)
      .subscribe(result => {
        var scores = result.json()['data'];
        for (var ind in scores) {
          var score = scores[ind];

          this.playerScores[score['OperatorPlayerName']] = {};
          this.playerScores[score['OperatorPlayerName']]['FantasyPointsDraftKings'] = score['FantasyPointsDraftKings'];
          this.playerScores[score['OperatorPlayerName']]['FantasyPointsFanDuel'] = score['FantasyPointsFanDuel'];
          this.playerScores[score['OperatorPlayerName']]['FantasyPointsYahoo'] = score['FantasyPointsYahoo'];
          this.playerScores[score['OperatorPlayerName']]['FantasyPointsFantasyDraft'] = score['FantasyPointsFantasyDraft'];
        }
      });
  }
  getDataForLineups = () => {
    this.pgs.getGames(this.currentOperator, this.currentSport, this.currentSlateID)
      .subscribe(result => {
        this.fixtures = result.json()['data'];

        this.pgs.getPlayers(this.currentOperator, this.currentSport, this.currentSlateID)
          .subscribe(result => {
            this.players = result.json()['data'];

            for (var player of this.players) {
              for (var fixture of this.fixtures) {
                if (fixture['HomeTeam'] == player['Team']) {
                  player['Opposition'] = fixture['AwayTeam'];
                  player['IsHomeTeam'] = 'Y';
                  break;
                } else if (fixture['AwayTeam'] == player['Team']) {
                  player['Opposition'] = fixture['HomeTeam'];
                  player['IsHomeTeam'] = 'N';
                  break;
                }
              }
            }

            this.cgs.getCompositions(this.currentOperator, this.currentSport)
              .subscribe(result => {
                this.comps = result.json()['data'][0];
                this.getHiddenLineups();
              });
          });
      });
  }
  getPositionsInLineup = () => {
    var lineupByPositions = [];

    var setup = this.comps['TeamSetup'];
    for (var i in setup) {
      var positionSetup = setup[i];
      var maxPlayers = positionSetup['NumPlayers'][1];

      for (var j = 0; j < maxPlayers; j++) {
        lineupByPositions.push({'Composition': positionSetup['Composition'], 'Player': null});
      }
    }
    return lineupByPositions;
  }
  memberIndex = (list, candidate, field) => {
    for (var mem in list) {
      if (list[mem][field] == candidate[field]) return parseInt(mem);
    }
    return -1;
  }
  memIndex = (list, candidate) => {
    for (var mem in list) {
      if (list[mem] == candidate) return parseInt(mem);
    }
    return -1;
  }
  // For provider public page
  numHiddenLineupPages = -1;
  currentLineupsPage = 1;
  getHiddenLineups = () => {
    this.currentLineupsPage = 1;
    this.lps.getHiddenLineups(this.currentOperator, this.currentSport).subscribe(result => {
       this.allLineupsWithHiding = result.json()['data'];
       this.getFilteredHiddenLineups();
    });
  }
  filteredHiddenLineups = [];
  pagesToShow = [];
  currPageHiddenLineups = [];
  getFilteredHiddenLineups = () => {
    var datePartToFilterUsing = 0;
    if (this.currentFilter == 1) {
      datePartToFilterUsing = this.currentDate.getFullYear();
    } else if (this.currentFilter == 2) {
      datePartToFilterUsing = this.currentDate.getMonth();
    } else {
      datePartToFilterUsing = this.weekOfYear(this.currentDate);
    }

    this.filteredHiddenLineups = [];
    for (var lineup of this.allLineupsWithHiding) {
      if ((lineup['Operator'] == this.currentOperator) && (lineup['Sport'] == this.currentSport) &&
        (lineup['Slate'] == this.currentSlate) && this.isWithinPeriod(lineup, datePartToFilterUsing)) {
        this.filteredHiddenLineups.push(lineup);
      }
    }
    this.numHiddenLineupPages = Math.round(this.filteredHiddenLineups.length / 10);

    this.showPagination();
  }
  showPagination = () => {
    this.pagesToShow = [];
    if (this.currentLineupsPage - 2 > 1) this.pagesToShow.push(-(this.currentLineupsPage - 3));
    for (var pageNum = this.currentLineupsPage - 2; pageNum < this.currentLineupsPage + 2; pageNum++) {
      if ((pageNum > 0) && (pageNum <= this.numHiddenLineupPages)) this.pagesToShow.push(pageNum);
    }
    if (this.currentLineupsPage + 2 < (this.numHiddenLineupPages - 2)) {
      this.pagesToShow.push(-(this.currentLineupsPage + 3));
      this.pagesToShow.push(this.numHiddenLineupPages - 1);
      this.pagesToShow.push(this.numHiddenLineupPages);
    } else if (this.currentLineupsPage + 2 == (this.numHiddenLineupPages - 2)) {
      this.pagesToShow.push(this.numHiddenLineupPages - 1);
      this.pagesToShow.push(this.numHiddenLineupPages);
    } else if (this.currentLineupsPage + 2 == (this.numHiddenLineupPages - 1)) {
      this.pagesToShow.push(this.numHiddenLineupPages);
    }

    var startIndex = (this.currentLineupsPage - 1) * 10;
    var endIndex = this.currentLineupsPage * 10;
    if (endIndex > this.filteredHiddenLineups.length) endIndex = this.filteredHiddenLineups.length;

    this.currPageHiddenLineups = this.filteredHiddenLineups.slice(startIndex, endIndex);

    var allPlayerNames = this.players.map(player => player['OperatorPlayerName']);
    var lineupByComp = this.getPositionsInLineup();
    for (var lineup of this.currPageHiddenLineups) {
      var ind = 0;

      var totalPoints = 0;
      var totalSalary = 0;
      for (var lineupPlayer of lineup['Lineup']) {
        if ((ind == 0) || (ind == 2) || (ind == 6) || (ind == 7)) {
          delete lineupPlayer['Name'];
          delete lineupPlayer['PlayerID'];

          lineupPlayer['_id'] = ind;
        }
        lineupPlayer['Player'] = (lineupPlayer.hasOwnProperty('Name')) ? this.players[this.memIndex(allPlayerNames, lineupPlayer['Name'])] : null;
        lineupPlayer['Position'] = lineupByComp[ind++]['Composition'];

        if ((lineupPlayer['Player'] != null) && (lineupPlayer['Player']['FantasyPoints' + this.currentOperator] != '')) {
          var currPoints = parseInt((lineupPlayer['Player'] == null) ? 0 : lineupPlayer['Player']['FantasyPoints' + this.currentOperator]);
          if (!isNaN(currPoints)) totalPoints += currPoints;
        }
        totalSalary += parseInt((lineupPlayer['Player'] == null) ? 0 : lineupPlayer['Player']['OperatorSalary']);
      }
      lineup['TotalPoints'] = totalPoints;
      lineup['TotalSalary'] = totalSalary;
    }
  }
  showSubscribePage = () => {
    this.router.navigate(['/user']);
  }
  isWithinPeriod = (lineup, datePart) => {
    var startDate = lineup['StartDate'];
    var year = startDate.substring(0, 4);
    var month = parseInt(startDate.substring(5, 7)) - 1;
    var day = startDate.substring(8, 10);

    var lineupDate = new Date(year, month, day);
    var lineupWeek = this.weekOfYear(lineupDate);

    if (this.currentFilter == 1) {
      if (datePart == year) return true;
    } else if (this.currentFilter == 2) {
      if (datePart == month) return true;
    } else {
      if (datePart == lineupWeek) return true;
    }
    return false;
  }
  weekOfYear = (date): number => {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  }
  setDate = (isForward) => {
    var time = this.currentDate.getTime();

    var year = this.currentDate.getFullYear();
    var month = this.currentDate.getMonth();

    if (this.currentFilter == 1) {
      year = isForward ? year + 1 : year - 1;
      this.currentDate.setFullYear(year);
    } else if (this.currentFilter == 2) {
      if (isForward) {
        month++;
        if (month == 12) {
          year++;
          month = 0;
        }
      } else {
        month--;
        if (month == -1) {
          year--;
          month = 11;
        }
      }
      this.currentDate.setFullYear(year);
      this.currentDate.setMonth(month);
    } else if (this.currentFilter == 3) {
      var diff = 7 * 24 * 3600 * 1000;
      time = isForward ? time + diff : time - diff;
      this.currentDate.setTime(time);
    }

    var date = this.currentDate.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/");
    this.currentDateStr = date.substring(5) + "/" + date.substring(0, 4);
  }
  downloadLineup = (lineupId) => {
    var lineupToDownload = null;
    for (var lineup of this.currPageHiddenLineups) {
      if (lineup['_id'] == lineupId) {
        lineupToDownload = lineup;
        break;
      }
    }

    if (lineupToDownload != null) {
      var data = lineupToDownload['Lineup'].map(playerDetails => playerDetails.hasOwnProperty('Name') ? playerDetails['Name'] : '');
      var blob = new Blob([data.toString()], {type: 'text/csv'});
      var url = window.URL.createObjectURL(blob);
      window.open(url);
    }
  }
}
