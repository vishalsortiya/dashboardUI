import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
import { SharedDataService } from '../services/shared-data.service';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatCardModule, HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  // providers:[WrappedSocket]
})
export class HomeComponent implements OnInit {
  message: string = '';  receivedMessage: string = '';  empData: any;  empDataError: any;   pollingInterval = 600;  pollingSubscription: Subscription = null!;

  // Use EventEmitter directly
  // areaTypeSelected = new EventEmitter<{ areaTypeName: string }>();

  loading: boolean = true; // Add a loading flag
  
  areaTypeCounts: { [key: string]: number } = {};
  areaTypeColors: { [key: string]: string } = {
    'Entire Factory': 'dark-blue',
    'TSP Production Area': 'red',
    'Assembly Area1': 'green',
    'Assembly Area2': 'purple',
    'Assembly Area3': 'blue'
    // Add more colors for other areaTypes as needed
  };



  constructor(private router: Router, private http: HttpClient,  //private webSocketService: WebSocketService,
    private sharedDataService: SharedDataService) {}

  // ngOnInit() {
     
  //   // Fetch initial data when the component is initialized
  //   this.fetchAllCounts();
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
        this.fetchAllCounts();
      });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }


  // ngOnInit() {
  //   // Listen for incoming messages
  //   this.webSocketService.onMessage().subscribe((message: string) => {
  //     this.receivedMessage = message;
  //   });

  //   // Listen for incoming empData events
  //   this.webSocketService.onEmpData().subscribe((data: any) => {
  //     console.log('Received empData:', data);
  //     this.empData = data;
  //     this.fetchAllCounts();
  //   });

  //   // Listen for incoming empDataError events
  //   this.webSocketService.onEmpDataError().subscribe((error: any) => {
  //     console.error('Error retrieving empData:', error);
  //     this.empDataError = error;
  //   });

  //    this.fetchAllCounts();
  // }

  fetchAllCounts() {
    this.http.get<{ [key: string]: number }>('http://localhost:3000/emp').subscribe(
      (countsForAllAreas) => {
        this.areaTypeCounts = countsForAllAreas;
        this.loading = false; // Set loading to false once data is fetched
      },
      (error) => {
        this.loading = false; // Set loading to false in case of an error
        console.error('Error fetching counts for all areas:', error);
      }
    );
  }

  // fetchAllCounts() {
  //   // Check if empData is defined before fetching counts
  //   if (this.empData) {
  //     this.areaTypeCounts = { ...this.empData }; // Copy empData to areaTypeCounts
  //     this.loading = false; // Set loading to false once data is fetched
  //   } else {
  //     this.loading = false; // Set loading to false in case of an error
  //     console.error('empData is undefined or null.');
  //   }
  // }

  getAreaTypeKeys(): string[] {
    return Object.keys(this.areaTypeCounts);
  }

  getAreaTypeColor(areaType: string) {
    return this.areaTypeColors[areaType];
  }

  navigateToPage(page: string): void {
    const formattedPage = page.toLowerCase().replace(/\s+/g, ''); // Replace spaces with an empty string
    const count = this.areaTypeCounts[page];
    const areaTypes = page;    
    // this.areaTypeSelected.emit({ areaTypeName: areaTypes });
    this.sharedDataService.setAreaType(areaTypes);
    this.router.navigate(['/dashboard/' + formattedPage.toLowerCase()]);
  }
}
