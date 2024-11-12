import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataBaseComponent } from './data-base/data-base.component';
import { NgIf, NgClass } from '@angular/common';
import { ImportantIssuesComponent } from './important-issues/important-issues.component';
import { KeywordOverviewComponent } from './keyword-overview/keyword-overview.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from '../services/navigate.home';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, DataBaseComponent, NgIf, ImportantIssuesComponent, KeywordOverviewComponent, NgClass, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentComponent: string = 'home'; // Componenta inițială
  seoForm: FormGroup; // FormGroup for SEO input
  urlError: string | null = null; // Error message for URL validation
  mode: string | undefined; // State variable for storing the current mode
  @Output() navigateToHome = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private navigationService: NavigationService) {
    // Initialize the reactive form with URL validation
    this.seoForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  ngOnInit(): void {
    const savedComponent = localStorage.getItem('home');
 // Forțăm revenirea la modul 'home' la încărcare inițială
 this.currentComponent = savedComponent ? savedComponent : 'home';
 localStorage.removeItem('home');
 this.navigationService.navigateHome$.subscribe(() => {
  this.showComponent('home');
});
}

  // Method to check the URL and navigate to dataBase component
  checkSeo() {
    if (this.seoForm.valid) {
      this.urlError = null; // Clear previous errors
      this.showComponent('dataBase'); // Navigate to dataBase component
    } else {
      this.urlError = 'Linkul nu este valid'; // Set error message
    }
  }

  // Method to switch the current component
  showComponent(component: string) {
    this.currentComponent = component;
    localStorage.setItem('home', component);
    if (component === 'home') {
      this.navigateToHome.emit(); // Emetem evenimentul când navigăm la 'home'
    }
    if (component === 'home') {
      this.seoForm.reset(); // Resetăm formularul când ne mutăm în modul 'home' 
    }
  }

  // Method to copy the current link to clipboard
  copyLink() {
    const link = window.location.href; // Get the current link
    navigator.clipboard.writeText(link); // Copy the link to clipboard
  }

  // Extract site name from the URL
  extractSiteName(url: string): string {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', ''); // Elimină 'www.' dacă există
    } catch {
      return ''; // În caz de eroare la parse, returnează un șir gol
    }
  }

  // Method to change the current mode and store it in localStorage
  
}
