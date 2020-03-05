import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { InterfaceMapPool} from '../models/mapPool';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-add-map-pools',
  templateUrl: './add-map-pools.component.html',
  styleUrls: ['./add-map-pools.component.css']
})
export class AddMapPoolsComponent implements OnInit,OnDestroy {

  mapPools: InterfaceMapPool [];
  mapPoolsArray: Array<Object> = [];
  @Input() gameName: string;
  showEditMapPoolsForm: boolean;
  mapPoolName: string;
  mapPoolMaps: string[];
  sub: any;

  constructor(private gameService: GameService, public dialog: MatDialog,private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
    console.log(this.gameName);
    this.gameService.getMapPools(this.gameName).subscribe(
      data => {
        this.mapPools = data;
        const keys = Object.keys(this.mapPools);
        for (let i = 0; i < keys.length; i++) {
        this.mapPoolsArray.push(this.mapPools[keys[i]]);
        this.mapPoolsArray[i]['mapPool'] = keys[i];
        }
    });

    this.sub = this.dataSharingService.getMapPoolUpdate().subscribe(message => {
      if (message) {
          console.log(message)
          this.doRerender();
      }
      else{
        console.log("no message")
      }
    });

  }

  onSubmit( mapPoolName: string) {
      this.gameService.saveMapPool(this.gameName, mapPoolName);
      this.doRerender();
  }

  openDialog(mapPool): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Are you sure you want to delete ' + mapPool
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameService.deleteMapPool(this.gameName, mapPool);
        this.doRerender();
      }
    });
  }

  editClicked(mapPoolName: string, maps: string[]) {
    this.showEditMapPoolsForm = !this.showEditMapPoolsForm;
    
    this.mapPoolName = mapPoolName;
    this.mapPoolMaps = maps;
  }

  doRerender() {
    console.log("rerendering")
    this.showEditMapPoolsForm = false;
    this.mapPoolsArray = [];
    this.sub.unsubscribe();
    setTimeout(() => this.ngOnInit(), 200);
  }

  ngOnDestroy(): void{
    this.sub.unsubscribe();
  }

}
