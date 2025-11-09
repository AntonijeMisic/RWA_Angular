import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AnnouncementsActions from './announcements.actions';
import { catchError, map, exhaustMap, of } from 'rxjs';
import { AnnouncementService } from '../../core/services/announcements/announcements.service';

@Injectable()
export class AnnouncementsEffects {
  private actions$ = inject(Actions);
  private announcementService = inject(AnnouncementService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnouncementsActions.loadAnnouncements),
      exhaustMap(() =>
        this.announcementService.getAllAnnouncements().pipe(
          map(announcements =>
            AnnouncementsActions.loadAnnouncementsSuccess({ announcements })
          ),
          catchError(error =>
            of(AnnouncementsActions.loadAnnouncementsFailure({ error }))
          )
        )
      )
    )
  );

  loadAnnouncementById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnouncementsActions.loadAnnouncementById),
      exhaustMap(({ id }) =>
        this.announcementService.getAnnouncementById(id).pipe(
          map(announcement =>
            AnnouncementsActions.loadAnnouncementByIdSuccess({ announcement })
          ),
          catchError(error =>
            of(AnnouncementsActions.loadAnnouncementByIdFailure({ error }))
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnouncementsActions.createAnnouncement),
      exhaustMap(({ announcement }) =>
        this.announcementService.create(announcement).pipe(
          map(newAnn =>
            AnnouncementsActions.createAnnouncementSuccess({ announcement: newAnn })
          ),
          catchError(error =>
            of(AnnouncementsActions.createAnnouncementFailure({ error }))
          )
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnouncementsActions.updateAnnouncement),
      exhaustMap(({ announcement }) =>
        this.announcementService.update(announcement).pipe(
          map(updated =>
            AnnouncementsActions.updateAnnouncementSuccess({ announcement: updated })
          ),
          catchError(error =>
            of(AnnouncementsActions.updateAnnouncementFailure({ error }))
          )
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AnnouncementsActions.deleteAnnouncement),
      exhaustMap(({ id }) =>
        this.announcementService.delete(id).pipe(
          map(() => AnnouncementsActions.deleteAnnouncementSuccess({ id })),
          catchError(error =>
            of(AnnouncementsActions.deleteAnnouncementFailure({ error }))
          )
        )
      )
    )
  );
}
