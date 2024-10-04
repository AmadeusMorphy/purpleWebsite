import { Component, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent {

  isLoading: boolean = false;
  loggedInUser: any = {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.getLoggedInUser()
    
  }

  getLoggedInUser(): void {
    this.isLoading = true;
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    this.changeDetectorRef.detectChanges()
    if (userId) {
      this.userService.getUser(userId).subscribe(user => {
        this.loggedInUser = user;
        console.log(this.loggedInUser)
        this.isLoading = false
      }, error => {
        this.isLoading = false
        console.error('Error fetching user data', error);
      });
    } else {
      alert('You have to login first')
        
        this.router.navigate(['/home'])
        console.error('No user ID found in local storage');
   
    }
  }
}
