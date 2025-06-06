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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this._loadDepartments();
  }

  private _loadDepartments(): void {
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
        this.totalCount$.next(response.infoPage?.totalCount || 0);
      });
  }

  onClickCreateDepartment() {
    const dialogRef = this._dialog.open(DepartmentWindowComponent);
    dialogRef.componentInstance.department
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._loadDepartments();
      });
  }

  onClickEditDepartment(department: IUserDepartment) {
    const dialogRef = this._dialog.open(DepartmentWindowComponent, {
      data: department, 
    });
    dialogRef.componentInstance.departmentData = department;

    dialogRef.componentInstance.department
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._loadDepartments();
      });
  }

  onClickDeleteDepartment(department: IUserDepartment) {
    if (
      confirm(`Вы уверены, что хотите удалить отделение ${department.name}?`)
    ) {
      this._departmentApiService
        .deleteDepartment(department.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._loadDepartments();
            this._snackBar.open(
              `Отделение "${department.name}" успешно удалено`,
              'Закрыть',
              {
                duration: 3000,
              }
            );
          },
          error: (error) => {
            console.error('Ошибка удаления отделения', error);
            this._snackBar.open(
              `Ошибка удаления отделения: ${error.message}`,
              'Закрыть',
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
          },
        });
    }
  }

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
  }
}
