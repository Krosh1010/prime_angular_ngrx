// modal.service.ts
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSubject = new Subject<void>();
  openModal$ = this.openModalSubject.asObservable();

  private modeSubject = new BehaviorSubject<'desktop' | 'phone'>('desktop');
  mode$ = this.modeSubject.asObservable();

  triggerOpenModal() {
    this.openModalSubject.next();
  }

  setMode(mode: 'desktop' | 'phone') {
    this.modeSubject.next(mode);
  }
}
