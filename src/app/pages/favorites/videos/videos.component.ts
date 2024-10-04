import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent {

  playlistItemForm!: FormGroup; // Form for playlist item
  loggedInUser: any = {};

  favVideo: any

  isLoading: boolean = true;

  sideBarVisible: boolean = false;

  currentThumbIndex: number = 0;
  slideshowInterval: any;
  isThumbnailPlaying: boolean = false;
  animationTimeout: number | undefined;
  selectedThumbs: string[] = [];
  videoItem: MenuItem[] | undefined;

  userDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messsageService: MessageService) { }

  ngOnInit(): void {
    this.playlistItemForm = this.fb.group({
      item: [''] // Form control for playlist item input
    });

    this.videoItem = [
      {
        label: 'Do stuff',
        items: [
          {
            label: 'Remove from favorites',
            icon: 'pi pi-ban',
            command: () => this.deleteVideo(this.favVideo.id)
          },
          {
            label: 'Add to watch later',
            icon: 'pi pi-clock'
          }
        ]
      }
    ];

    // Fetch the logged-in user data (you would probably get this from a login or user management service)
    this.getLoggedInUser();
  }

  getLoggedInUser(): void {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    this.changeDetectorRef.detectChanges()
    if (userId) {
      this.userService.getUser(userId).subscribe(user => {
        this.loggedInUser = user;
        this.isLoading = false
      }, error => {
        console.error('Error fetching user data', error);
      });
    } else {
      this.userDialog = true
      alert('You have to login first')
        
        this.router.navigate(['/home'])
        console.error('No user ID found in local storage');
   
    }
  }

  getLoggedInUserFav() {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  }

  addPlaylistItem(): void {
    const newItem = this.playlistItemForm.value.item; // Get the new playlist item from the form

    if (this.loggedInUser) {
      this.userService.updatePlaylist(this.loggedInUser.id, newItem).subscribe(
        (updatedUser) => {
          console.log('Playlist updated!', updatedUser);
          this.loggedInUser = updatedUser; // Update the user data in the component
        },
        (error) => {
          console.error('Error updating playlist', error);
        }
      );
    } else {
      console.error('No logged-in user found.');
    }
  }


  deleteVideo(videoId: string) {
    if (this.loggedInUser) {
      this.userService.deleteVideoFromPlaylist(this.loggedInUser.id, this.favVideo.videoId).subscribe(
        (updateUser) => {
          console.log('DELETED FROM THE DB: ', updateUser);
          this.messsageService.add({ severity: 'success', summary: 'Video Deleted!', icon: 'pi pi-times', detail: 'It has been removed from your favorites' });
          this.loggedInUser = updateUser;

        },
        (error) => {
          console.error('Error deleting video: ', error);
        }
      );
    } else {
      console.error('No user found');
    }
  }

  selectedFav(videoId: string) {


    console.log(this.loggedInUser)

    const clickedFav = this.loggedInUser.playlist.find((video: { videoId: string; }) => video.videoId === videoId);

    if (clickedFav) {


      this.favVideo = clickedFav;
      console.log("you clicked on it: ", clickedFav)
    } else {
      console.log('not found')
    }
  }

  playAnimation(videoId: string) {
    // Find the selected video by its unique ID
    const clickedFav = this.loggedInUser.playlist.find((videoT: { videoId: string; }) => videoT.videoId === videoId);


    this.getLoggedInUserFav()

    if (clickedFav) {

      this.changeDetectorRef.detectChanges();
      clickedFav.isThumbnailPlaying = true; // Set animation state for the specific video
      this.currentThumbIndex = 0;
      this.selectedThumbs = clickedFav.thumbs;

      // Cycle through thumbnails every 500ms
      this.slideshowInterval = setInterval(() => {
        this.currentThumbIndex = (this.currentThumbIndex + 1) % this.selectedThumbs.length;
      }, 700);
    }
  }

  stopSlideshow(videoId: string) {
    const clickedFav = this.loggedInUser.playlist.find((videoT: { videoId: string; }) => videoT.videoId === videoId);


    if (clickedFav) {
      clickedFav.isThumbnailPlaying = false; // Stop animation for the specific video
      clearInterval(this.slideshowInterval);
    }
  }

}
