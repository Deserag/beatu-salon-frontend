import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
}
