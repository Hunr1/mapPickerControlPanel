import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DataSharingService {


  private subject = new Subject<any>();
  
  private mapPool = new Subject<any>();  
  private gameFormat = new Subject<any>();
  private maps = new Subject<any>();
  private game = new Subject<any>();


    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    sendMessage(message: string) {
        this.subject.next({text: message});
    }

    
    clearMessages() {
        this.subject.next();
    }

    requestMapPoolUpdate(message: string) {
        this.mapPool.next({text: message});
    }

    getMapPoolUpdate(): Observable<any> {
        return this.mapPool.asObservable();
    }

    requestGameFormatUpdate(message: string) {
        this.gameFormat.next({text: message});
    }

    getGameFormatUpdate(): Observable<any> {
        return this.gameFormat.asObservable();
    }

    requestMapsUpdate(message: string) {
        this.maps.next({text: message});
    }

    getMapsUpdate(): Observable<any> {
        return this.maps.asObservable();
    }

    requestEditGameUpdate(message: string) {
        this.game.next({text: message});
    }

    getEditGameUpdate(): Observable<any> {
        return this.game.asObservable();
    }
}
