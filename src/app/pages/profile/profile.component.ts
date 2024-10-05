import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageUploadService } from '../services/image-upload.service';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {

  visible: boolean = false;
  uploadedFiles: any[] = [];
  imageUrl: any;
  isLoading: boolean = false;
  currentUserId: any;
  profImg: any;
  loggedInUser: any = {};

  userName: any;
  checkLength: any;

  currentUserImg: string = '';

  constructor(
    private messageService: MessageService,
    private imageUploadService: ImageUploadService,
    private userService: UserService,
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.checkUserLoggedIn()
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file); // Store uploaded files in the array
      this.uploadImageToImgBB(file);
    }
  }

  uploadImageToImgBB(file: File): void {
    this.isLoading = true;
    this.imageUploadService.uploadImage(file).subscribe(
      response => {
        if (response && response.data && response.data.url) {
          console.log('Image uploaded successfully:', response.data.url);
          this.imageUrl = response.data.url;
          this.putImgDb()
          // Save the uploaded image URL
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'File Uploaded', detail: 'Image uploaded successfully!' });
        }
      },
      error => {
        this.isLoading = false;
        console.error('Upload failed:', error);
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Could not upload image.' });
      }
    );
  }

  onEdit() {
    this.visible = true;
  }


  checkUserLoggedIn() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user
    this.loggedInUser = !!user;
    const userName = localStorage.getItem('username')
    console.log(this.loggedInUser)
    if (user) {
      this.loggedInUser == true;
      this.userName = userName
      this.http.get(`https://66fbddf48583ac93b40d8ce0.mockapi.io/users/login/${this.currentUserId}`).subscribe(
        (res: any) => {
          this.currentUserImg = res.profileImg[0]
          console.log(res.profileImg?.length)
          this.checkLength = res.profileImg?.length

        }
      )


      console.log("You are logged in as: ", this.currentUserId);
    } else {
      this.loggedInUser == false;
      console.error("You're not logged in")
    }// Check if user data exists
  }




  putImgDb() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user


    if (this.loggedInUser) {
      this.userService.uploadImage(this.currentUserId, this.imageUrl).subscribe(
        (updateUs) => {

          console.log('image to the user: ', this.imageUrl)
          console.log('ADDED TO THE DB: ', updateUs);
          this.loggedInUser = updateUs;
          this.checkUserLoggedIn()
        },
        (error) => {
          console.error('Error Bitch: ', error)
        }
      );
    } else {

      console.error('No user found')
    }

  }
}