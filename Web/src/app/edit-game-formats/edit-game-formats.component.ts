import { Component, Input } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-edit-game-formats',
  templateUrl: './edit-game-formats.component.html',
  styleUrls: ['./edit-game-formats.component.css'],
})
export class EditGameFormatsComponent{

  @Input() gameName: string;
  @Input() formatName: string;
  @Input() winsRequired: string;

  constructor(private gameService: GameService, private dataSharingService: DataSharingService ) { 
  }

  onSubmit(FormatNameNew: string, winsRequiredNew: number) {
    this.gameService.editGameFormat(this.gameName, this.formatName, FormatNameNew, winsRequiredNew);
    this.dataSharingService.requestGameFormatUpdate("update");
  }
 
}

