import { Component, Input, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { SEOData } from '../../models/seo_model';
import { selectSEOData } from '../../store/selectors/seo.selectors';
import { NgIf, CommonModule } from '@angular/common';
import { LinkService } from '../../services/link.service';
import * as SEOActions from '../../store/actions/seo.action';

@Component({
  selector: 'app-keyword-overview',
  standalone: true,
  imports: [NgIf,CommonModule],
  templateUrl: './keyword-overview.component.html',
  styleUrl: './keyword-overview.component.css'
})
export class KeywordOverviewComponent {
  seoData$: Observable<SEOData | null>;
  private subscriptions: Subscription[] = [];
  @Input() siteLinkChange: string = ''; // Link-ul primit din HomeComponent
  @Input() siteNameChange: string = ''; // Denumirea site-ului
  seoData: SEOData | null = null; // Stocăm datele locale
  

  constructor(
    private store: Store,
    private linkService: LinkService
  ) {
    this.seoData$ = this.store.select(selectSEOData);
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.linkService.siteLink$.subscribe(link => {
        this.siteLinkChange = link;
      }),
      this.linkService.siteName$.subscribe(name => {
        this.siteNameChange = name;
      })
    );
      // Dispatch action to load SEO data when the component initializes
      this.store.dispatch(SEOActions.loadSEOData());
  }
  updateSiteData(name: string, link: string): void {
    this.siteNameChange = name;
    this.siteLinkChange = link;
    localStorage.setItem('siteNameChange', this.siteNameChange);
    localStorage.setItem('siteLinkChange', this.siteLinkChange);
  }
  
}
