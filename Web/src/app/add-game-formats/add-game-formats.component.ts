import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { InterfaceGameFormat} from '../models/gameFormat';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-add-game-formats',
  templateUrl: './add-game-formats.component.html',
  styleUrls: ['./add-game-formats.component.css']
})
export class AddGameFormatsComponent implements OnInit,OnDestroy {
 
  @Input() gameName: string;
  gameFormats: InterfaceGameFormat [];
  gameFormatsArray: Array<Object> = [];
  showEditGameFormatsForm: boolean;
  formatName: string;
  winsRequired: string;
  sub: any;

  constructor(private gameService: GameService, public dialog: MatDialog,private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
  console.log(this.gameName);
    this.gameService.getFormats(this.gameName).subscribe(
      data => {
        this.gameFormats = data;
        const keys = Object.keys(this.gameFormats);
        for (let i = 0; i < keys.length; i++) {
        this.gameFormatsArray.push(this.gameFormats[keys[i]]);
        this.gameFormatsArray[i]['format'] = keys[i];
        }
    });

    this.sub = this.dataSharingService.getGameFormatUpdate().subscribe(message => {
      if (message) {
          console.log(message)
          this.doRerender();
      }
      else{
        console.log("no message")
      }
    });
  }

  onSubmit( gameFormatName: string, winsRequired:number) {
        this.gameService.saveGameFormat(this.gameName,gameFormatName,winsRequired);
        this.doRerender();
  }

  openDialog(formatName): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete ' + formatName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameService.deleteGameFormat(this.gameName, formatName);
        this.doRerender();
      }
    });
  }

  editClicked(formatName: string, winsRequired:string) {
    this.showEditGameFormatsForm = !this.showEditGameFormatsForm;

    this.formatName = formatName;
    this.winsRequired = winsRequired;
  }

  doRerender() {
    console.log("rerendering")
    this.showEditGameFormatsForm = false;
    this.gameFormatsArray = [];
    this.sub.unsubscribe();
    setTimeout(() => this.ngOnInit(), 200);
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }
}
