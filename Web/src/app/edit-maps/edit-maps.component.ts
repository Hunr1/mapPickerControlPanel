import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-edit-maps',
  templateUrl: './edit-maps.component.html',
  styleUrls: ['./edit-maps.component.css']
})
export class EditMapsComponent implements OnInit {
  name = new FormControl('');
  @Input() gameName: string;
  @Input() mapName: string;
  @Input() mapImage: string;

  constructor(private gameService: GameService,private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
  }

  onSubmit(mapNameNew: string, mapImage: string) {
    this.gameService.editMap(this.gameName, this.mapName, mapNameNew, mapImage);
    this.dataSharingService.requestMapsUpdate("update");
  }

}
