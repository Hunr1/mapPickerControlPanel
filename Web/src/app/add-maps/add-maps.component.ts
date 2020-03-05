import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { InterfaceMap} from '../models/map';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataSharingService } from '../data-sharing-service.service'


@Component({
  selector: 'app-add-maps',
  templateUrl: './add-maps.component.html',
  styleUrls: ['./add-maps.component.css']
})
export class AddMapsComponent implements OnInit,OnDestroy {
  
  maps: InterfaceMap [];
  mapsArray: Array<Object> = [];
  showEditMapsForm: boolean;
  @Input() gameName: string;

  mapName: string;
  mapImage: string;
  sub: any; 

  constructor(private gameService: GameService, public dialog: MatDialog, private dataSharingService: DataSharingService) {

  }

  ngOnInit(): void {
    console.log(this.gameName);
    this.gameService.getMaps(this.gameName).subscribe(
      data => {
        this.maps = data;
        const keys = Object.keys(this.maps);
        for (let i = 0; i < keys.length; i++) {
        this.mapsArray.push(this.maps[keys[i]]);
        this.mapsArray[i]['maps'] = keys[i];
        }
    });

    this.sub = this.dataSharingService.getMapsUpdate().subscribe(message => {
      if (message) {
          console.log(message)
          this.doRerender();
      }
      else{
        console.log("no message")
      }
    });
  }

  onSubmit(gameName: string, mapName: string, mapImage: string) {
    this.gameService.saveMap(gameName, mapName, mapImage);
    this.doRerender();
  }

  openDialog(map): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete ' + map
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameService.deleteMap(this.gameName, map);
        this.doRerender();
      }
    });
  }

  editClicked(mapName: string, mapImage: string) {
    this.showEditMapsForm = !this.showEditMapsForm;
    
    this.mapName = mapName;
    this.mapImage = mapImage;
    this.dataSharingService.sendMessage("test");
  }


   doRerender() {
    console.log("rerendering")
    this.showEditMapsForm = false;
    this.maps = [];
    this.mapsArray = [];
    this.sub.unsubscribe();
    setTimeout(() => this.ngOnInit(), 300);
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

}
