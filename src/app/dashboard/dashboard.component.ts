import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input'; // Add this line
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DataService } from '../dataservice';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from '../home/home.component';
import { SharedDataService } from '../services/shared-data.service';
import { MatPaginatorModule } from '@angular/material/paginator'; // Add this line
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardPopupComponent } from './dashboard-popup/dashboard-popup.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatPaginatorModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DataService, HomeComponent]
})

export class DashboardComponent implements OnInit {
  pageName: string = ''; inData: any[] = []; outData: any[] = []; totalHeadcount: number = 0; count: number = 0;  functAllCount: { [key: string]: number } = {}; 
  areaTypeName: string = ''; areaTypes: string = '';  pollingInterval = 600; pollingSubscription: Subscription = null!; functTypeList: any[] = [];
  functTypeKey: string = ''; isTableVisible: boolean = false;

  displayedColumns: string[] = ['EmpID', 'FunctionType', 'Name', 'ContactNo'];
  dataSource = new MatTableDataSource<any>(this.functTypeList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private dataservice: DataService, private homeComponent: HomeComponent, private route: ActivatedRoute,   private cdr: ChangeDetectorRef,
             private sharedDataService: SharedDataService, private dialog: MatDialog) { }

  // ngOnInit(): void {
  //   // // Subscribe to the areaTypeSelected event
  //   // this.homeComponent.areaTypeSelected.subscribe((selectedAreaData: { areaTypeName: string}) => {
  //   //   this.areaTypeName = selectedAreaData.areaTypeName;
  //   //   // this.totalHeadcount = selectedAreaData.count;
  //   // });

  //   // this.sharedDataService.areaType$.subscribe((areaType: string) => {
  //   //   this.areaTypeName = areaType;
  //   //   this.loadTotalHeadcount();
  //   // });

  //   this.pageName = this.route.snapshot.params['page'];
  //   this.areaTypeName = this.formatPageName(this.route.snapshot.params['page']);
  //   this.loadTotalHeadcount();
  // }


  ngOnInit(): void {
    this.startPolling();
    console.log('start');
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  startPolling(): void {
    this.pollingSubscription = interval(this.pollingInterval)
      .subscribe(() => {
        this.pageName = this.route.snapshot.params['page'];
        this.areaTypeName = this.formatPageName(this.route.snapshot.params['page']);
        this.loadTotalHeadcount();
      });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private formatPageName(pageName: string): string {
    switch (pageName.toLowerCase()) {
      case 'entirefactory':
        return 'Entire Factory';
      case 'tspproductionarea':
        return 'TSP Production Area';
      case 'assemblyarea1':
        return 'Assembly Area1';
      case 'assemblyarea2':
        return 'Assembly Area2';
      case 'assemblyarea3':
        return 'Assembly Area3';
      default:
        return pageName;
    }
  }

  loadTotalHeadcount() {
    this.dataservice.getTotalHeadcount(this.pageName).subscribe(
      (data: any) => {
        this.totalHeadcount = data.totalHeadcount;
      },
      (error) => {
        console.error('Error retrieving data:', error);
      })
    this.loadInData(); this.fetchAllFunctCount(); this.loadFunctTypeList(this.functTypeKey);
  }

  loadInData() {
    this.dataservice.getInAndOutData(this.pageName).subscribe(
      (data: any) => {
        this.inData = data.inData;
        this.outData = data.outData;
      },
      (error) => {
        console.error('Error retrieving data:', error);
      })
  }

  fetchAllFunctCount() {
    this.dataservice.getFunctTypeCount(this.pageName).subscribe(
      (data: any) => {

        this.functAllCount = data;
        // this.cdr.detectChanges(); // Manually trigger change detection if needed
        // console.log('Fetched data:', this.functAllCount);
      },
      (error) => {
        console.log('Error for functType:', error);
      }
    );
  }

  // New method to fetch data for the material table
  loadFunctTypeList(functTypeKey: string): void {
    this.dataservice.getFunctListData(this.pageName).subscribe(
      (data: any) => {
        // Assuming the data returned is an array of objects with properties like EmpID, FunctionType, Name, ContactNo
        this.functTypeList = data;
        this.dataSource.data = this.functTypeList;
      },
      (error) => {
        console.error('Error retrieving functTypeList data:', error);
      }
    );
  }

  getFunctTypeKeys(): string[] {
    return Object.keys(this.functAllCount);
  }

  // Updated method to handle click event
  functTypelick(functTypeKey: string): void {
    console.log('Clicked on:', functTypeKey);
    // Call the method to load data for the material table
    this.loadFunctTypeList(functTypeKey);
    // Set the visibility of the table to true
    this.isTableVisible = true;
    // Open the pop-up
    this.openTablePopup(functTypeKey);
  }

  // New method to open the pop-up
  openTablePopup(functTypeKey: string): void {
    const isMobile = window.innerWidth < 1000; // Adjust the breakpoint as needed
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = isMobile ? '90%' : '40%'; // Adjust the width for mobile devices
    dialogConfig.maxWidth = '90vw'; // Set maximum width to 90 viewport width
    dialogConfig.height = isMobile ? '90%' : '80%'; // Adjust the height for mobile devices
    dialogConfig.maxHeight = '90vh'; // Set maximum height to 90 viewport height
    dialogConfig.data = { functTypeKey, functTypeList: this.functTypeList };
  
    this.dialog.open(DashboardPopupComponent, dialogConfig);
  }
  

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}


