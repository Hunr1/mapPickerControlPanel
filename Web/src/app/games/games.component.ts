import { Component,OnInit,OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { InterfaceGame } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit,OnDestroy{
  games: InterfaceGame [];
  gamesArray: Array<Object> = [];
  showAddGameForm: boolean = false;
  showEditGameForm: boolean = false;
  gameNameOld: string;
  gameCreatorOld: string;
  gameLogoOld: string;
  sub: any;

  constructor(private gameService: GameService, public dialog: MatDialog,private dataSharingService: DataSharingService) {

  }
  
  ngOnInit(): void {
    console.log("oninit")
    this.dataSharingService.clearMessages()
    this.gamesArray = [];
    this.games = [];
    this.gameService.getGames().subscribe(
      data => {
        this.games = data;
        const keys = Object.keys(this.games) // new stuff starts here
        for (let i = 0; i < keys.length; i++) {
        this.gamesArray.push(this.games[keys[i]]);
        this.gamesArray[i]['games'] = keys[i];
      }
    });

    this.sub = this.dataSharingService.getEditGameUpdate().subscribe(message => {
      if (message) {
          console.log(message);
          this.doRerender();

      }
      else{
        console.log("no message")
      }
    })
  }

  // deleting game
  openDialog(game): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete ' + game
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.gameService.deleteGame(game);
        this.doRerender();
      }
    })
  }

  // editing game
  editClicked(gameName: string, gameCreator: string, gameLogo: string) {
    this.showEditGameForm = !this.showEditGameForm;
    this.showAddGameForm = false;
    this.gameNameOld = gameName;
    this.gameCreatorOld = gameCreator;
    this.gameLogoOld = gameLogo;
  }

  // adding new game
  addClicked() {
    console.log('Add clicked');
    this.showEditGameForm = false;
    this.showAddGameForm = !this.showAddGameForm;
  }

  doRerender() {
    console.log("rerendering")
    this.showAddGameForm = false;
    this.showEditGameForm = false;
    this.games = [];
    this.gamesArray = [];
    this.sub.unsubscribe();
    setTimeout(() => this.ngOnInit(), 300);
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

}
