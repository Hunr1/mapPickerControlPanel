import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { GameService } from './game.service';
import { GamesComponent } from './games/games.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddGameFormComponent } from './add-game-form/add-game-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditGameFormComponent } from './edit-game-form/edit-game-form.component';
import { EditGameParentComponent } from './edit-game-parent/edit-game-parent.component';
import { AddMapsComponent } from './add-maps/add-maps.component';
import { EditMapsComponent } from './edit-maps/edit-maps.component';
import { AddMapPoolsComponent } from './add-map-pools/add-map-pools.component';
import { EditMapPoolsFormComponent } from './edit-map-pools-form/edit-map-pools-form.component';
import { AddGameFormatsComponent } from './add-game-formats/add-game-formats.component';
import { EditGameFormatsComponent } from './edit-game-formats/edit-game-formats.component';
import { DataSharingService } from './data-sharing-service.service';

const material = [
  MatGridListModule
]

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    AddGameFormComponent,
    ConfirmationDialogComponent,
    EditGameFormComponent,
    EditGameParentComponent,
    AddMapsComponent,
    EditMapsComponent,
    AddMapPoolsComponent,
    EditMapPoolsFormComponent,
    AddGameFormatsComponent,
    EditGameFormatsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    material,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [DataSharingService],
  bootstrap: [AppComponent]
})

export class AppModule {}
