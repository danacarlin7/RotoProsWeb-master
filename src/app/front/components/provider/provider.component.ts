import {Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

import {PlayerGetService} from '../../services/fetchPlayers';
import {CompGetService} from '../../services/fetchCompositions';
import {LineupPostService} from '../../services/postLineups';
import {AuthService} from '../../../shared/services/auth.service';

import * as $ from 'jquery';

@Component({
  selector: 'provider-root',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css'],
  providers: [PlayerGetService, CompGetService, LineupPostService, AuthService]
})
export class ProviderComponent implements OnInit, OnDestroy {
  private subscription:Subscription;

  title = '';

  operators = ['DraftKings', 'FanDuel'];
  sports = ['MLB', 'PGA'];

  currentOperator = 'DraftKings';
  currentSport = 'MLB';
  currentSlate = '';
  currentSlateID = 0;

  currLineupName = '';

  slates = [];
  players = [];
  fixtures = [];

  lineupPlayers = [];
  playersAsked = false;

  sortType = '';
  sortReverse = false;

  filterText = '';
  filteredPlayers = [];

  compositions = [];
  positionsByComp = {};
  currComposition = '';
  showAll = true;
  comps = {};

  playerScores = {};

  salaryCap = 0;

  uploadErrors = [];

  providers = [];
  currProvider = "";

  addedPlayers = [];

  userName = "";
  userRole = "";
  userData = null;

  lineupID = "";
  providerLineups = [];
  lineupsOnlyName = [];

  allLineupsWithHiding = [];

  constructor(private authService:AuthService, private pgs:PlayerGetService, private cgs:CompGetService, private lps:LineupPostService) {
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

    this.pgs.getSlates(this.currentOperator, this.currentSport)
      .subscribe(result => {
        this.slates = this.deDuplicateSlates(result.json()['data']);
        if (this.currentSlate == '') this.setSlate(this.slates[0].SlateID + "--" + this.slates[0].Slate);
        this.showPlayersForSlate();
      });
  }

  ngOnInit() {
    let timer = TimerObservable.create(2000, 3600000);
    this.subscription = timer.subscribe(t => this.getScores());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
  setSlate = (slate) => {
    if (this.currentSlateID + "--" + this.currentSlate != slate) {
      this.playersAsked = false;
    }
    this.currentSlateID = parseInt(slate.split("--")[0]);
    this.currentSlate = slate.split("--")[1];
  }
  showSlates = () => {
    this.pgs.getSlates(this.currentOperator, this.currentSport)
      .subscribe(result => {
        this.slates = this.deDuplicateSlates(result.json()['data']);
        if (this.currentSlate == '') this.setSlate(this.slates[0].SlateID + "--" + this.slates[0].Slate);
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
  showPlayersForSlate = () => {
    this.uploadErrors = [];
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

            this.compositions = [];
            this.positionsByComp = {};
            this.currComposition = '';

            this.cgs.getCompositions(this.currentOperator, this.currentSport)
              .subscribe(result => {
                console.log("provider data => ", result.json());
                this.comps = result.json()['data'][0];
                for (var index in this.comps['Composition']) {
                  var composition = this.comps['Composition'][index];
                  for (var j in composition['Comps']) {
                    var comp = composition['Comps'][j];

                    var isCompExisting = false;
                    for (var existingComp of this.compositions) {
                      if (existingComp == comp) {
                        isCompExisting = true;
                        break;
                      }
                    }
                    if (!isCompExisting) {
                      this.compositions.push(comp);
                      this.positionsByComp[comp] = [];
                    }
                    this.positionsByComp[comp].push(composition['Position']);
                  }
                }

                if (this.comps['ShowAll'] == 'true') {
                  this.showAll = true;
                  this.compositions.push('ALL');
                } else {
                  this.showAll = false;
                }
                this.salaryCap = this.comps['SalaryCap'];
                if (this.currComposition == '') this.currComposition = this.compositions[0];
                this.getCurrPlayersInComposition(this.players, this.currComposition);
                this.filterText = '';
                this.lineupPlayers = this.getPositionsInLineup();

                this.lineups = '';

                this.sortType = '';
                this.sortReverse = false;

                this.addedPlayers = [];
                this.playersAsked = true;
              });
          });
      });
    this.lps.getProviders(this.currentOperator, this.currentSport, this.currentSlateID).subscribe(result => {
      console.log("slate data => ", result.json());
      this.providers = result.json();
      if ((this.currProvider == '') && (this.providers.length > 0))  this.currProvider = this.providers[0];
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
  findPlayerPosition = (player, lineup):Object => {
    for (var i in lineup) {
      var comp = lineup[i];
      if ((comp['Player'] == null) && (player['OperatorPosition'].indexOf(comp['Composition']) != -1)) {
        return {'errMsg': null, 'position': i};
      }
    }
    return {
      'position': -1,
      'errMsg': 'Player (' + player['OperatorPlayerName'] + ') of position (' + player['OperatorPosition'] + ') does not have free slot in lineup.'
    };
  }
  showPlayersForComposition = (composition) => {
    this.currComposition = composition;
    this.filterByText();
    if ((this.sortType != null) && (this.sortType != '')) {
      this.orderByField(this.sortType, false);
    }
  }
  addPlayerToLineup = (playerName, gameID) => {
    for (var i in this.filteredPlayers) {
      var player = this.filteredPlayers[i];
      if ((player.OperatorPlayerName == playerName) && (player.SlateGameID == gameID)) {
        var positionOrError = this.findPlayerPosition(player, this.lineupPlayers);
        if ((positionOrError != null) && (positionOrError['position'] != -1)) {
          this.lineupPlayers[positionOrError['position']]['Player'] = player;
        } else if ((positionOrError != null) && (positionOrError['errMsg'] != null) && (positionOrError['errMsg'] != '')) {
          this.uploadErrors = [positionOrError['errMsg']];
          return;
        }
        break;
      }
    }
    this.addedPlayers.push(this.filteredPlayers[i]);
    this.filterByText();
    if ((this.sortType != null) && (this.sortType != '')) {
      this.orderByField(this.sortType, false);
    }
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
  removePlayerFromLineup = (playerName, gameID) => {
    for (var i in this.lineupPlayers) {
      var player = this.lineupPlayers[i]['Player'];
      if (player == null) continue;
      if ((player.OperatorPlayerName == playerName) && (player.SlateGameID == gameID)) {
        this.lineupPlayers[i]['Player'] = null;
        break;
      }
    }
    for (var i in this.addedPlayers) {
      var player = this.addedPlayers[i];
      if ((player.OperatorPlayerName == playerName) && (player.SlateGameID == gameID)) {
        break;
      }
    }
    this.addedPlayers.splice(parseInt(i), 1);

    this.filterByText();
    if ((this.sortType != null) && (this.sortType != '')) {
      this.orderByField(this.sortType, false);
    }
  }

  orderByField = (sortColumn, toggleReverse) => {
    if (toggleReverse) {
      if (this.sortType == sortColumn) {
        this.sortReverse = !this.sortReverse;
      } else {
        this.sortReverse = false;
      }
    }
    this.sortType = sortColumn;

    this.filteredPlayers.sort(function (a, b) {
      if (a[this.sortType] < b[this.sortType])
        return (this.sortReverse ? 1 : -1);
      if (a[this.sortType] > b[this.sortType])
        return (this.sortReverse ? -1 : 1);
      return 0;
    }.bind(this));
  }

  filterByText = () => {
    this.getCurrPlayersInComposition(this.players, this.currComposition);
    if (this.filterText != '') {
      this.filteredPlayers = this.filteredPlayers.filter(item => new RegExp(this.filterText, 'gi').test(item['OperatorPlayerName']) ||
      new RegExp(this.filterText, 'gi').test(item['OperatorPosition']) ||
      new RegExp(this.filterText, 'gi').test(item['OperatorSalary']) || new RegExp(this.filterText, 'gi').test(item['Team']) ||
      new RegExp(this.filterText, 'gi').test(item['Opposition']) || new RegExp(this.filterText, 'gi').test(item['IsHomeTeam']));
    }
  }
  removeAddedPlayersFromList = () => {
    for (var i = this.filteredPlayers.length - 1; i >= 0; i--) {
      for (var j in this.addedPlayers) {
        if (this.addedPlayers[j]['OperatorPlayerName'] == this.filteredPlayers[i]['OperatorPlayerName']) {
          this.filteredPlayers.splice(i, 1);
        }
      }
    }
  }
  getCurrPlayersInComposition = (players, composition) => {
    if (composition == 'ALL') {
      this.filteredPlayers = players;
      this.removeAddedPlayersFromList();

      this.getScores();
      this.getLineups();
      return;
    }
    var playersForComp = [];
    for (var i in players) {
      var player = players[i];
      for (var j in this.positionsByComp[composition]) {
        var position = this.positionsByComp[composition][j];
        if (position == player['OperatorPosition']) {
          playersForComp.push(player);
          break;
        }
      }
    }
    this.filteredPlayers = playersForComp;
    this.removeAddedPlayersFromList();
    this.getScores();
    this.getLineups();
  }

  getLineupsForCurrDayAndSlate = (allLineups): Object[] => {
    var today = new Date().toJSON().slice(0, 10);

    var currLineups = [];
    for (var lineup of allLineups) {
      if (lineup['SlateID'] == this.currentSlateID) {
        var lineupDate = lineup['StartDate'].slice(0, 10);
        if (lineupDate == today) {
          currLineups.push(lineup);
        }
      }
    }
    return currLineups;
  }
  getLineups = () => {
    this.lps.getLineups(this.currentOperator, this.currentSport).subscribe(result => {
      this.providerLineups = this.getLineupsForCurrDayAndSlate(result.json()['data']);
	  this.lineupsOnlyName = this.providerLineups;
	  for (var i in this.lineupsOnlyName) {
	      this.lineupsOnlyName[i]['Lineup'] = this.lineupsOnlyName[i]['Lineup'].map(player => player['Name']);
	  }
    });
  }
  resetLineup = () => {
    this.uploadErrors = [];
    this.lineupID = "";
    for (var i in this.lineupPlayers) {
      this.lineupPlayers[i]['Player'] = null;
    }
  }
  setName = (lineup) => {
    this.lps.updateLineup(this.currentOperator, this.currentSport, this.currentSlate, this.userName, lineup['_id'], {'_id': lineup['_id'], 'Lineup': lineup['Lineup'], 'LineupName': lineup['LineupName']}).subscribe();
  }
  updateLineup = () => {
    var lineup = this.lineupPlayers.map(player => (player['Player'] == null) ? {} : {'Name': player['Player']['OperatorPlayerName'], 'PlayerID': player['Player']['OperatorPlayerID']});
    this.lps.updateLineup(this.currentOperator, this.currentSport, this.currentSlate, this.userName, this.lineupID, {'_id': this.lineupID, 'Lineup': lineup, 'LineupName': this.currLineupName}).subscribe();
  }
  deleteLineup = (id) => {
    this.lps.deleteLineup(this.currentOperator, this.currentSport, this.currentSlate, this.userName, id).subscribe();
    this.getLineups();
  }
  loadLineup = (id) => {
    this.resetLineup();
    this.lineupID = id;

    var currLineup = [];
    for (var i in this.providerLineups) {
      if (this.providerLineups[i]['_id'] == id) {
        currLineup = this.providerLineups[i]['Lineup'];
      }
    }

    var allPlayerNames = this.players.map(player => player['OperatorPlayerName']);
    var lineupPlayers2 = currLineup.map(player => this.players[this.memIndex(allPlayerNames, player)]);
    var lineupByComp = this.getPositionsInLineup();
    for (var j in lineupByComp) {
      lineupByComp[j]['Player'] = lineupPlayers2[j];
    }
    this.lineupPlayers = lineupByComp;
  }
  addLineup = () => {
    this.uploadErrors = this.checkLineup(this.lineupPlayers);
    if (this.uploadErrors.length == 0) {
      var lineup = this.lineupPlayers.map(player => (player['Player'] == null) ? {} : {'Name': player['Player']['OperatorPlayerName'], 'PlayerID': player['Player']['OperatorPlayerID']});

      var today = new Date().toJSON().slice(0, 10);
      this.uploadLineup({
        'Operator': this.currentOperator,
        'ProviderName': this.userName,
        'Sport': this.currentSport,
        'Slate': this.currentSlate,
		'SlateID': this.currentSlateID,
        'StartDate': today,
        'Lineup': lineup
      });
    }
  }
  addLineups = (lineupsStr) => {
    this.uploadErrors = [];
    var allPlayerNames = this.players.map(player => player['OperatorPlayerName']);

    var lineups = lineupsStr.split("\n");
    for (var i in lineups) {
      if ((lineups[i] == null) || (lineups[i] == '')) continue;
      var lineup = lineups[i].split(",");
      var lineupPlayers2 = lineup.map(playerName => this.players[this.memIndex(allPlayerNames, playerName)]);

      var lineupByComp = this.getPositionsInLineup();
      for (var j in lineupByComp) {
        lineupByComp[j]['Player'] = lineupPlayers2[j];
      }
      var uploadErrors = this.checkLineup(lineupByComp);

      if (uploadErrors.length == 0) {
	    var lineupByPlayerIDs = lineupPlayers2.map(player => function(player) { return {'Name': player['OperatorPlayerName'], 'PlayerID': player['OperatorPlayerID']}});
        var today = new Date().toJSON().slice(0, 10);
        this.uploadLineup({
          'Operator': this.currentOperator,
          'ProviderName': this.userName,
          'Sport': this.currentSport,
          'Slate': this.currentSlate,
		  'SlateID': this.currentSlateID,
          'StartDate': today,
          'Lineup': lineupByPlayerIDs
        });
      }
      for (var k in uploadErrors) {
        this.uploadErrors.push(uploadErrors[k]);
      }
    }

    this.getLineups();
  }
  checkLineup = (lineup) => {
    var uploadErrors2 = [];
    var lineupSal = 0;
    for (var i in lineup) {
      lineupSal = lineupSal + parseInt((lineup[i]['Player'] != null) ? lineup[i]['Player']['OperatorSalary'] : '0');
    }
    if (lineupSal > this.salaryCap) {
      uploadErrors2.push("Salary can't be more than " + this.salaryCap + ", it is currently " + lineupSal + ".");
    }

    var numPlayersByComp = {};
    for (var i in lineup) {
      var playerWithPos = lineup[i];
      if (playerWithPos['Player'] == null) continue;

      if (numPlayersByComp.hasOwnProperty(playerWithPos['Composition'])) {
        numPlayersByComp[playerWithPos['Composition']] = numPlayersByComp[playerWithPos['Composition']] + 1;
      } else {
        numPlayersByComp[playerWithPos['Composition']] = 1;
      }
    }
    var teamSetup = this.comps['TeamSetup'];
    for (var i in teamSetup) {
      var comp = teamSetup[i]['Composition'];

      var numPlayersWithComp = 0;
      if (numPlayersByComp.hasOwnProperty(comp)) {
        numPlayersWithComp = numPlayersByComp[comp];
      }

      var numPlayersAllowed = teamSetup[i]['NumPlayers'];
      if ((numPlayersWithComp < numPlayersAllowed[0]) || (numPlayersWithComp > numPlayersAllowed[1])) {
        uploadErrors2.push(comp + " position, number of players should be between " + numPlayersAllowed[0] + " and " + numPlayersAllowed[1] + ". They are currently " + numPlayersWithComp);
      }
    }

    return uploadErrors2;
  }
  uploadLineup = (lineup) => {
    this.lps.createLineup(lineup).subscribe();
  }

  lineups = "";
  getLineupsFromCSV = (fileName) => {
    var myReader:FileReader = new FileReader();
    myReader.onloadend = function (e) {
      this.lineups = myReader.result;
    }.bind(this);
    myReader.readAsText(fileName);
  }
  uploadCSVLineups = () => {
    this.addLineups(this.lineups);
  }

  setProvider = (provider) => {
    this.currProvider = provider;
  }

  clickUpload = () => {
    $('#fileControl').trigger('click');
  }
  populateUpload = (fileName) => {
    $('#fileTextBox').val(fileName.replace(/C:\\fakepath\\/i, ''));
  }
}
