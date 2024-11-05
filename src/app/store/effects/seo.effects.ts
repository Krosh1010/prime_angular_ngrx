// src/app/store/seo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SEOService } from '../../services/seo.service';
import * as SEOActions from '../actions/seo.action';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class SEOEfects {
  loadSEOData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SEOActions.loadSEOData),
      mergeMap(() =>
        this.seoService.getSEOData().pipe(
          map(data => SEOActions.loadSEODataSuccess({ data })),
          catchError(error => of(SEOActions.loadSEODataFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private seoService: SEOService) {}
}
