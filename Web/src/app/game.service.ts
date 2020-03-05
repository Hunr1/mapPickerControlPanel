import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { InterfaceGame } from './models/game';
import { InterfaceMap } from './models/map';
import { InterfaceMapPool } from './models/mapPool';
import { InterfaceGameFormat } from './models/gameFormat';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // private urlGames = 'http://localhost:4040/API/game';
  // private urlMaps = 'http://localhost:4040/API/map';
  // private urlMapPools = 'http://localhost:4040/API/mapPool'
  // private urlGameFormats = 'http://localhost:4040/API/gameFormat'
  
  private urlGames = 'https://limitless-peak-50429.herokuapp.com/API/game';
  private urlMaps = 'https://limitless-peak-50429.herokuapp.com/API/map';
  private urlMapPools = 'https://limitless-peak-50429.herokuapp.com/API/mapPool';
  private urlGameFormats = 'https://limitless-peak-50429.herokuapp.com/API/gameFormat'
 
  private subject = new Subject<any>();
  
  constructor(private http: HttpClient) { }

  getGames(): Observable<InterfaceGame[]> {
    return this.http.get<InterfaceGame[]>(this.urlGames + '/get');
  }

  saveGame(gameName: string, gameCreator: string, gameLogo: string) {

    console.log('saving new game')
    const body = {
      'gameName' : gameName,
      'creator' : gameCreator,
      'logo' :gameLogo,
    };

    this.http.post(this.urlGames + '/add', body).toPromise().then((data: any) => {
      console.log(data);
      return 'ok';
    });
  }

  editGame(gameNameOld: string, gameNameNew: string, gameCreator: string, gameLogo: string) {

    console.log('editing game');
    console.log(gameNameOld);
    console.log(gameNameNew);
    console.log(gameCreator);
    console.log(gameLogo);
    const body = {
      'gameNameOld' : gameNameOld,
      'gameNameNew' : gameNameNew,
      'creator' : gameCreator,
      'logo' :gameLogo,
    };

    this.http.post(this.urlGames + '/update' , body).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  deleteGame(gameName: string) {

    console.log('deleting game')
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName
      }
    };

    console.log(options);

    this.http.delete(this.urlGames + '/delete', options).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  getMaps(gameName: string): Observable<InterfaceMap[]> {
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName
      }
    };
    return this.http.get<InterfaceMap[]>(this.urlMaps + '/get', options);
  }

  saveMap(gameName: string, mapName: string, mapImage: string) {

    console.log('saving new map')
    const body = {
      'gameName' : gameName,
      'mapName' : mapName,
      'mapImage' : mapImage,
    };

    this.http.post(this.urlMaps + '/add', body).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  editMap(gameName: string, mapNameOld: string, mapNameNew: string, mapImage: string) {

    console.log('editing map');
    console.log(gameName);
    console.log(mapNameOld);
    console.log(mapNameNew);
    console.log(mapImage);
    
    const body = {
      'gameName' : gameName,
      'mapNameOld' : mapNameOld,
      'mapNameNew' : mapNameNew,
      'mapImage' : mapImage,
    };

    this.http.post(this.urlMaps + '/update' , body).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  deleteMap(gameName: string, mapName: string) {

    console.log('deleting map')
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName,
      'mapName' : mapName
      }
    };

    console.log(options);

    this.http.delete(this.urlMaps + '/delete', options).toPromise().then((data: any) => {
      console.log(data);
    });
  }


  getMapPools(gameName: string): Observable<InterfaceMapPool[]> {
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName
      }
    };
    return this.http.get<InterfaceMapPool[]>(this.urlMapPools + '/get', options);
  }

  saveMapPool(gameName: string, mapPoolName: string) {

    console.log('saving new map pool');
    const body = {
      'gameName' : gameName,
      'poolName' : mapPoolName,
    };

    this.http.post(this.urlMapPools + '/add', body).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  deleteMapPool(gameName: string, mapPoolName: string) {

    console.log('clicked delete');
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName,
      'poolName' : mapPoolName
      }
    };

    console.log(options);

    this.http.delete(this.urlMapPools + '/delete', options).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  editMapPool(gameName: string, mapPoolNameOld: string, mapPoolNameNew: string) {

    console.log('editing map pool');
   
    const body = {
      'gameName' : gameName,
      'poolNameOld' : mapPoolNameOld,
      'poolNameNew' : mapPoolNameNew ,
    };
    
    console.log(body);
    this.http.post(this.urlMapPools + '/update', body).toPromise().then((data: any) => {
      console.log(data);
    });

  }

    addMapsToMapPool(gameName: string, mapPoolName: string, mapsInPool) {
      console.log('adding maps to pool');
      console.log('kartat lisättävänä');
      console.log(mapsInPool);
      console.log("haetaan poolia nimellä");
      console.log(mapPoolName);
      
      const body = {
        'gameName' : gameName,
        'poolName' : mapPoolName,
        'maps' : mapsInPool ,
      };
    
      console.log(body);
      this.http.post(this.urlMapPools + '/addMaps', body).toPromise().then((data: any) => {
        console.log(data);
    });
  }

    RemoveMapsFromMapPool(gameName: string, mapPoolName: string, mapsToRemove) {
      console.log('adding maps to pool');
      console.log('kartat lisättävänä');
      console.log(mapsToRemove);
      console.log("haetaan poolia nimellä");
      console.log(mapPoolName);
      
      const body = {
        'gameName' : gameName,
        'poolName' : mapPoolName,
        'maps' : mapsToRemove ,
      };
    
      console.log(body);
      this.http.post(this.urlMapPools + '/removeMaps', body).toPromise().then((data: any) => {
        console.log(data);
    });
  }

  getFormats(gameName: string): Observable<InterfaceGameFormat[]> {
    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName
      }
    };
    return this.http.get<InterfaceGameFormat[]>(this.urlGameFormats + '/get', options);
  }


  saveGameFormat(gameName: string, formatName: string,winsRequired: number) {

    console.log('saving new game format');
    const body = {
      'gameName' : gameName,
      'formatName' : formatName,
      'winsRequired' : winsRequired
    };

    this.http.post(this.urlGameFormats + '/add', body).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  deleteGameFormat(gameName: string, formatName: string) {

    const options = {
      headers: {'Content-Type': 'application/json'},
      params: {
      'gameName' : gameName,
      'formatName' : formatName
      }
    };

    console.log(options);

    this.http.delete(this.urlGameFormats + '/delete', options).toPromise().then((data: any) => {
      console.log(data);
    });
  }

  editGameFormat(gameName: string, gameFormatNameOld: string, gameFormatNameNew: string, winsRequired: number) {

    console.log('editing game format');
   
    const body = {
      'gameName' : gameName,
      'formatNameOld' : gameFormatNameOld,
      'formatNameNew' : gameFormatNameNew,
      'winsRequired': winsRequired
    };
    
    console.log(body);
    this.http.post(this.urlGameFormats + '/update', body).toPromise().then((data: any) => {
      console.log(data);
    });

  }

}
