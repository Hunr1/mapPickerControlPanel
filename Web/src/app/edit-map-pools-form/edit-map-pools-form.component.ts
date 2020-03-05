import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { InterfaceMap} from '../models/map';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-edit-map-pools-form',
  templateUrl: './edit-map-pools-form.component.html',
  styleUrls: ['./edit-map-pools-form.component.css']
})
export class EditMapPoolsFormComponent implements OnInit{
  @Input() gameName: string;
  @Input() mapPoolName: string;
  @Input() mapsInPool: [];
  mapsInPoolArr = new Array(); 
  mapsToRemoveFromDatabase = new Array();
  maps: InterfaceMap [];
  mapsArray: Array<Object> = [];
  sub: any;

  constructor(private gameService: GameService,private dataSharingService: DataSharingService) { }
  
  ngOnInit(): void {
    for(let index in this.mapsInPool)
    {
      let item = this.mapsInPool[index]['mapName'];
      this.mapsInPoolArr.push(item);
    }
    this.gameService.getMaps(this.gameName).subscribe(
      data => {
        this.maps = data;
        const keys = Object.keys(this.maps);
        for (let i = 0; i < keys.length; i++) {
        this.mapsArray.push(this.maps[keys[i]]);
        this.mapsArray[i]['maps'] = keys[i];
        }
    });
  }

  onSubmit(mapPoolNameNew: string){
    console.log('mapPoolNameNew = ');
    console.log(mapPoolNameNew);
    if(mapPoolNameNew === ''){
      console.log('luodaan map pool nimellä = ');
      console.log(this.mapPoolName);
      this.gameService.addMapsToMapPool(this.gameName, this.mapPoolName, this.mapsInPoolArr);
      this.gameService.RemoveMapsFromMapPool(this.gameName, this.mapPoolName, this.mapsToRemoveFromDatabase);
    }
    else{
      console.log('luodaan map pool nimellä = ');
      console.log(this.mapPoolName);
      this.gameService.addMapsToMapPool(this.gameName, this.mapPoolName, this.mapsInPoolArr);
      this.gameService.RemoveMapsFromMapPool(this.gameName, this.mapPoolName, this.mapsToRemoveFromDatabase);
      this.gameService.editMapPool(this.gameName, this.mapPoolName, mapPoolNameNew);
    }
    this.dataSharingService.requestMapPoolUpdate("update");
  }

  mapClicked(mapName: string){
    console.log(mapName);
    if(this.mapsInPoolArr.includes(mapName)){
      console.log("poistettiin")
      this.mapsInPoolArr.splice( this.mapsInPoolArr.indexOf(mapName), 1 );
      this.mapsToRemoveFromDatabase.push(mapName);
      console.log(mapName)
    } else{
      console.log("lisättiin")
      this.mapsInPoolArr.push(mapName);
      this.mapsToRemoveFromDatabase.splice( this.mapsToRemoveFromDatabase.indexOf(mapName), 1 );
      console.log(mapName)
    }
  }

  checkIfMapWasInPool(mapName: string){
    if(this.mapsInPoolArr.includes(mapName)){
      return true;
    } else{
      return false;
    }
  }

  doRerender() {
    console.log("rerendering")
    this.dataSharingService.clearMessages();
    this.mapsInPoolArr = [];
    setTimeout(() => this.ngOnInit(), 200);
  }


}
