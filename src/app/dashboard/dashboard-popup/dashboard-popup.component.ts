import { Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input'; // Add this line
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-popup',
  templateUrl: './dashboard-popup.component.html',
  standalone: true,
  imports: [MatPaginatorModule, MatInputModule, MatTableModule, MatIconModule, MatSortModule, CommonModule],
  styleUrls: ['./dashboard-popup.component.css']
})
export class DashboardPopupComponent {
  displayedColumns: string[] = ['EmpCode', 'FunctionType', 'Name', 'ContactNo'];;
  functTypeList: any[] = []; functTypeKey: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private _mdr: MatDialogRef<DashboardPopupComponent>) { }

  ngOnInit(): void {
    this.functTypeList = this.data.functTypeList;
    this.functTypeKey = this.data.functTypeKey;

    console.log('functTypeList:', this.functTypeList);
    // this.dataSource.data = this.functTypeList;  
    this.dataSource.data = this.functTypeList.filter(a => a.FunctionType === this.functTypeKey);
    //this.displayedColumns =  this.displayedColumns;
    console.log('displayedColumns:', this.displayedColumns);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
 
  closeDialog() {
    this._mdr.close(false)
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}