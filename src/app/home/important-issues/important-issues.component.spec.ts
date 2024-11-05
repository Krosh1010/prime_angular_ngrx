import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantIssuesComponent } from './important-issues.component';

describe('ImportantIssuesComponent', () => {
  let component: ImportantIssuesComponent;
  let fixture: ComponentFixture<ImportantIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportantIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportantIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
