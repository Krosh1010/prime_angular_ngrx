import { Component, OnInit,EventEmitter, Output, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from '../services/navigate.home';
import { Router } from '@angular/router';
import { LinkService } from '../services/link.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgIf, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentComponent: string = 'home'; // Componenta inițială
  seoForm: FormGroup; // FormGroup for SEO input
  urlError: string | null = null; // Error message for URL validation
  mode: string | undefined; // State variable for storing the current mode
  @Output() navigateToHome = new EventEmitter<void>();
  @Output() siteLinkChange = new EventEmitter<string>(); // Emite link-ul
  @Output() siteNameChange = new EventEmitter<string>(); // Emite numele site-ului

  constructor(private fb: FormBuilder, 
    private navigationService: NavigationService,
    private router: Router,
    private linkService: LinkService  
  ) {
    // Initialize the reactive form with URL validation
    this.seoForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  ngOnInit(): void {
    const savedComponent = localStorage.getItem('home');
 this.currentComponent = savedComponent ? savedComponent : 'home';
 localStorage.removeItem('home');
 this.navigationService.navigateHome$.subscribe(() => {
});
}


  // Method to check the URL and navigate to dataBase component
  checkSeo() {
    if (this.seoForm.valid) {
      const url = this.seoForm.get('url')?.value;
      this.linkService.updateSiteLink(url);
      this.linkService.updateSiteName(this.extractSiteName(url));
      this.router.navigate(['base']);
    } else {
      this.urlError = 'Linkul nu este valid';
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
