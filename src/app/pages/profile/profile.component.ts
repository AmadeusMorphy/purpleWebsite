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
  isDelete: boolean = false
  userName: any;
  checkLength: any;
  dateJoined: Date | null = null;

  compressedImg: any;
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
          window.location.reload()
          this.isLoading = false;
          this.visible = false
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

  openDelete() {
    this.isDelete = true
  }
  onDeleteImg() {
    this.userService.deleteImage(this.currentUserId, this.currentUserImg).subscribe(
      (res: any) => {
        console.log('Img deleted: ', res)
        this.isDelete = false
        this.checkUserLoggedIn()
        window.location.reload()
      }, (error) => {
        console.log('Error stuff', error)
      }
    )
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
          this.currentUserImg = res.profileImg

          this.reduceImageQuality(this.currentUserImg, 0.1).then((compressedImage) => {

            this.compressedImg = compressedImage
          });

          this.checkLength = res.profileImg?.length
          const onDateJoined = res.DateJoined
          this.dateJoined = new Date(onDateJoined)
        }
      )


      console.log("You are logged in as: ", this.currentUserId);
    } else {
      this.loggedInUser == false;
      console.error("You're not logged in")
    }// Check if user data exists
  }

  reduceImageQuality(imageUrl: string, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle cross-origin images if necessary
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Failed to get 2D context'));
        }

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Get the data URL with reduced quality (JPEG supports quality adjustments)
        const reducedQualityImage = canvas.toDataURL('image/jpeg', quality);

        resolve(reducedQualityImage);
      };

      img.onerror = (error) => reject(error);
    });
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