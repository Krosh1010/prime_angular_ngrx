import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { Store } from '@ngrx/store';
import { AuthState } from './store/reducers/auth.reducers';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private store: Store<{ auth: AuthState }>) {}

  ngOnInit() {
    this.store.select((state) => state.auth.token).subscribe((token) => {
    });
  }
}
