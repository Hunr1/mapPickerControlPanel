import { Component} from '@angular/core';
import { FormControl, FormsModule} from '@angular/forms';
import { GameService } from '../game.service';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-add-game-form',
  templateUrl: './add-game-form.component.html',
  styleUrls: ['./add-game-form.component.css']
})

export class AddGameFormComponent {


  constructor(private gameService: GameService, private dataSharingService: DataSharingService) {}
  
  onSubmit(gameName: string, gameCreator: string, gameLogo: string ) {
    this.gameService.saveGame(gameName, gameCreator, gameLogo);
    this.dataSharingService.requestEditGameUpdate("update");
  }
}
