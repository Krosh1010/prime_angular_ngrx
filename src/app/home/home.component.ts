import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataBaseComponent } from "./data-base/data-base.component";
import { NgIf, NgClass } from '@angular/common';
import { ImportantIssuesComponent } from "./important-issues/important-issues.component";
import { KeywordOverviewComponent } from "./keyword-overview/keyword-overview.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, DataBaseComponent, NgIf, ImportantIssuesComponent, KeywordOverviewComponent, NgClass,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentComponent: string = 'home'; // Componenta inițială
  seoForm: FormGroup; // FormGroup for SEO input
  urlError: string | null = null; // Error message for URL validation

  constructor(private fb: FormBuilder) {
    // Initialize the reactive form with URL validation
    this.seoForm = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  // Method to check the URL and navigate to dataBase component
  checkSeo() {
    if (this.seoForm.valid) {
      this.urlError = null; // Clear previous errors
      this.showComponent('dataBase'); // Navigate to dataBase component
    } else {
      this.urlError = 'Linkul nu etse valid'; // Set error message
    }
  }

  // Method to switch the current component
  showComponent(component: string) {
    this.currentComponent = component;
  }

  // Method to copy the current link to clipboard
  copyLink() {
    const link = window.location.href; // Get the current link
    navigator.clipboard.writeText(link); // Copy the link to clipboard
  }
}
