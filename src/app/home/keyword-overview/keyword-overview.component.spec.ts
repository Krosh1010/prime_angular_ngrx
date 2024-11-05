import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordOverviewComponent } from './keyword-overview.component';

describe('KeywordOverviewComponent', () => {
  let component: KeywordOverviewComponent;
  let fixture: ComponentFixture<KeywordOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeywordOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeywordOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
