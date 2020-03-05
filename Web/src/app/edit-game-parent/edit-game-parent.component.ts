import { Component, OnInit,Input } from '@angular/core';
import { DataSharingService } from '../data-sharing-service.service'

@Component({
  selector: 'app-edit-game-parent',
  templateUrl: './edit-game-parent.component.html',
  styleUrls: ['./edit-game-parent.component.css']
})
export class EditGameParentComponent implements OnInit {

  showEditGame: boolean = true;
  showAddMaps: boolean = false;
  showAddMapPools: boolean = false;
  showAddGameFormats: boolean = false;
  @Input() gameNameOld: string;
  @Input() gameCreatorOld: string;
  @Input() gameLogoOld: string;
  sub: any;

  constructor(private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
    this.showEditGame = false;
    this.showAddMaps = false;
    this.showAddMapPools = false;
    this.showAddGameFormats = false;

    this.sub = this.dataSharingService.getEditGameUpdate().subscribe(message => {
      if (message) {
          console.log(message)
          this.doRerender();
      }
      else{
        console.log("no message")
      }
    });
  }

  AddMapsClicked() {
    this.showEditGame = false;
    this.showAddMaps = true;
    this.showAddMapPools = false;
    this.showAddGameFormats = false;
    console.log('Add maps');
  }

  AddMapPoolsClicked() {
    this.showEditGame = false;
    this.showAddMaps = false;
    this.showAddMapPools = true;
    this.showAddGameFormats = false;
    console.log('Add map pools');
  }

  EditGameClicked() {
    this.showEditGame = true;
    this.showAddMaps = false;
    this.showAddMapPools = false;
    this.showAddGameFormats = false;
    console.log('Edit game');
  }

  AddGameFormatsClicked() {
    this.showEditGame = false;
    this.showAddMaps = false;
    this.showAddMapPools = false;
    this.showAddGameFormats = true;
    console.log('Add game formats');
  }

  doRerender() {
    console.log("rerendering")
    this.sub.unsubscribe();
    setTimeout(() => this.ngOnInit(), 300);
  }

}
