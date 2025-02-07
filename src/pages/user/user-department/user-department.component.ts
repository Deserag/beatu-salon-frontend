import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { IUserDepartment, TResGetDepartment, UserApiService } from '@entity';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { ERouteConstans } from '@routes';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DepartmentWindowComponent } from 'src/widgets/user/department-window/department-window.component';
@Component({
  selector: 'app-user-department',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './user-department.component.html',
  styleUrl: './user-department.component.scss',
})
export class UserDepartmentComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['Name', 'Description', 'Actions'];
   dataSource$ = new BehaviorSubject<IUserDepartment[]>([]);
    totalCount$ = new BehaviorSubject<number>(0);
    private _page$ = new BehaviorSubject<number>(1);
    private _pageSize$ = new BehaviorSubject<number>(10);
    private _departmentApiService = inject(UserApiService);
    private _dialog = inject(MatDialog);
    private _destroyRef = inject(DestroyRef);
    private _router = inject(Router);
  
  constructor(
  ) {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._departmentApiService.getUserDepartment({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetDepartment) => {
        this.dataSource$.next(response.rows);
        // this.totalCount$.next(response.infoPage.totalCount);
      });

    this._destroyRef.onDestroy(() => {
      this._page$.complete();
      this._pageSize$.complete();
      this.dataSource$.complete();
      this.totalCount$.complete();
    });
  }

  onClickCreateDepartment() {
    const dialogRef = this._dialog.open(DepartmentWindowComponent);
    dialogRef.componentInstance.department.subscribe((newDepartment: IUserDepartment) => {
      this._page$.next(this._page$.value);
    })
  }

  onClickEditDepartment(department: IUserDepartment) {}

  onClickDeleteDepartment(department: IUserDepartment) {}

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
  }
}
