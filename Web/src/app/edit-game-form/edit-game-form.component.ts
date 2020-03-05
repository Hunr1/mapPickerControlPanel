import { Component, Input } from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-edit-game-form',
  templateUrl: './edit-game-form.component.html',
  styleUrls: ['./edit-game-form.component.css'],
})

export class EditGameFormComponent {
  name = new FormControl('');
  @Input() gameNameOld: string;
  @Input() gameCreatorOld: string;
  @Input() gameLogoOld: string;

  constructor(private gameService: GameService,private dataSharingService: DataSharingService) { }

  onSubmit(gameNameOld: string, gameNameNew: string, gameCreator: string, gameLogo: string ) {
    this.gameService.editGame(gameNameOld, gameNameNew, gameCreator, gameLogo);
    this.dataSharingService.requestEditGameUpdate("update");
  }

}
