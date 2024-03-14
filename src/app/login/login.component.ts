// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient , HttpClientModule} from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MatCardModule, MatIconModule,
     MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent {
  loginValid: boolean = true; // Add this line to define loginValid
  username: string = "";
  password: string = "";
  hide: boolean = true;  // Declare the 'hide' property

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  login(): void {
   this.http.get('assets/users.json').subscribe((data:any) => {
    const users = data.users;

    const validUser= users.find(
      (user: any) => user.username === this.username && user.password === this.password 
      );

      if(validUser){
        this.router.navigate(['home']);
      } else{
        this.loginValid = false;
        alert('Invalid credentials');
      }
   });
  }
}


//   login(): void {
//     this.authService.authenticate(this.username, this.password).subscribe(
//       isAuthenticated => {
//         if (isAuthenticated) {
//           this.router.navigate(['/home']);
//         } else {
//           console.log("invalid password")
//         }
//       }
//     );
//   }
// }


// // src/app/login/login.component.ts
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary forms modules
// import { AuthService } from '../auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup; // Declare a FormGroup

//   constructor(
//     private formBuilder: FormBuilder, // Inject FormBuilder
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.formBuilder.group({
//       username: ['', Validators.required], // Set up form controls
//       password: ['', Validators.required]
//     });
//   }

//   login(): void {
//     const { username, password } = this.loginForm.value;

//     this.authService.authenticate(username, password).subscribe(
//       isAuthenticated => {
//         if (isAuthenticated) {
//           this.router.navigate(['/home']);
//         } else {
//           // Handle invalid credentials
//         }
//       }
//     );
//   }
// }
