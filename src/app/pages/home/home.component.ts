import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem, MessageService } from 'primeng/api';
import { ImageSlideshowService } from 'src/app/image-slideshow.service';
import { DialogService } from '../services/dialog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs';
import { FunctionsService } from '../services/functions.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = true;


  searchQuery: string = '';
  currentCard: any;
  changePage: number = 1;

  puTest: string = 'Put Test';
  loggedInUser: any = {};
  currentUserId: any;

  adult: {
    videoId: string,
    imgUrl: string,
    videoUrl: string,
    title: string,
    views: number,
    length: number,
    thumbs: string[],
    keywords: string,
    isAnimationPlaying: boolean;  // Updated thumbs to store string URLs of thumbnails
  }[] = [];

  adultSEO: {
    videoId: string,
    imgUrl: string,
    videoUrl: string,
    title: string,
    views: number,
    length: number,
    thumbs: string[],
    keywords: string,
    isAnimationPlaying: boolean;  // Updated thumbs to store string URLs of thumbnails
  }[] = [];

  adultSearch: any[] = []

  currentThumbIndex: number = 0;
  slideshowInterval: any;
  isAnimationPlaying: boolean = false;
  animationTimeout: number | undefined;
  selectedThumbs: string[] = [];
  videoItem: MenuItem[] | undefined;

  chipLabels: string[] = ['Hot', 'Milf', 'Teen', 'Lesbian', 'Missionary', 'Arab', 'Blond', 'Porn Stars', 'Models'];

  favVideo: any


  filteredSearch: any[] = []

  searchTerm: string = '';
  isInput: boolean = true;

  constructor(
    private http: HttpClient,
    private imageSlideshowService: ImageSlideshowService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private userService: UserService,
    private functionService: FunctionsService,
    private messsageService: MessageService
  ) {

  }

  ngOnInit() {
    this.getAdult(); // Fetch the data

    // this.myDb()
    this.checkUserLoggedIn()
    // this.freeApi()

    this.videoItem = [
      {
        label: 'Do stuff',
        items: [
          {
            label: 'Add to favorites',
            icon: 'pi pi-heart',
            command: () => this.putDb()
          },
          {
            label: 'Add to watch later',
            icon: 'pi pi-clock'
          }
        ]
      }
    ];
  }

  // freeApi() {

  //   this.http.get('https://api.redtube.com/?data=redtube').subscribe(
  //     (res: any) => {
  //       console.log('FREE API: ', res)
  //     }
  //   )
  // }


  // myDb() {
  //   const myApi = 'http://localhost:3000/users'
  //   this.http.get(`${myApi}`).subscribe(
  //     (res: any) => {
  //       console.log(res)
  //     }
  //   )
  // }


  logChipLabel(label: string) {
    this.isLoading = true;
    this.searchQuery = label
    this.getAdult()
  }

  getLoggedInUser(): void {
    const userId = localStorage.getItem('Id'); // Retrieve user ID from local storage
  }

  checkUserLoggedIn() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user
    this.loggedInUser = !!user;

    console.log(this.loggedInUser)
    if (user) {
      this.loggedInUser == true;
      console.log("You are logged in as: ", user);
    } else {
      this.loggedInUser == false;
      console.error("You're not logged in")
    }// Check if user data exists
  }
  putDb() {
    const newFav = this.favVideo

    if (this.loggedInUser) {
      this.userService.updatePlaylist(this.currentUserId, newFav).subscribe(
        (updateUser) => {
          console.log('ADDED TO THE DB: ', updateUser);
          this.loggedInUser = updateUser;

          this.messsageService.add({ severity: 'success', summary: 'Video Added!', icon: 'pi pi-heart', detail: 'Its now in your favorites' });
        },
        (error) => {
          console.error('Error Bitch: ', error)
        }
      );
    } else {
      this.messsageService.add({ severity: 'success', summary: 'Not logged in', icon: 'pi pi-times', detail: 'You have to login first' });

      console.error('No user found')
    }

  }

  numberOfVid: number = 52;

  getAdult() {
    this.isLoading = true;
    const adultApi = `https://www.eporner.com/api/v2/video/search/?query=${this.searchQuery}&per_page=1000&page=${this.changePage}&thumbsize=big&order=top-weekly&gay=0&lq=1&format=json`;

    this.http.get(adultApi).subscribe(
      (res: any) => {
        // Mapping data
        this.adult = res.videos.map((item: any) => {
          return {
            videoId: item.id,  // Unique video ID
            imgUrl: item.default_thumb.src,
            videoUrl: item.embed,
            title: item.title,
            views: item.views,
            length: item.length_min,
            keywords: item.keywords,
            thumbs: item.thumbs.map((thumb: any) => thumb.src) // Extract all thumbnails
          };
        });
        this.adultSearch = [...this.adult];
        this.filterSearch(); // Apply search filter after fetching videos
        this.isLoading = false;
        console.log("ALL OF THE VIDEOS: ", res);
      },
      (error) => {
        console.error("Failed to fetch videos:", error);
        this.isLoading = true;
      }
    );
  }

  filterSearch() {
    if (!this.searchTerm) {
      this.filteredSearch = [...this.adult]; // Reset filtered results to all videos
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSearch = this.adult.filter((video) =>
        video.keywords.toLowerCase().includes(term) ||
        video.videoId.toLowerCase().includes(term) ||
        video.title.toLowerCase().includes(term)
      );
    }

    // Adjust numberOfVid based on filtered results
    if (this.filteredSearch.length < 52) {
      this.numberOfVid += 10


    } else {
      return; // Reset to 52 if more than 52 videos
    }

    console.log("Filtered Videos:", this.filteredSearch);
  }

  onNextPage() {
    this.isLoading = true
    this.changePage++;

    this.getAdult();
  }
  onPreviusPage() {
    this.isLoading = true
    this.changePage--;
    this.getAdult();

  }
  /* PAGINATOR */

  first: number = 0;

  rows: number = 10;

  id: number = 0;
  currentPage: number = 0;


  onPageChange(event: any) {
    this.isLoading = true

    if (event.page > this.currentPage) {
      this.id += 1;
      this.onNextPage();
    } else if (event.page < this.currentPage) {
      this.id -= 1
      this.onPreviusPage()
    }
    this.currentPage = event.page

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    console.log(this.searchQuery)
    this.getAdult()
  }


  updateSearch(query: string) {
    this.onSearch(query);
  }

  onHome() {
    this.searchQuery = '';
    this.changePage = 1;

    this.getAdult()
  }

  // Start showing thumbnails when hovering over the video
  playAnimation(videoId: string) {
    // Find the selected video by its unique ID
    const selectedVideo = this.adult.find(video => video.videoId === videoId);
    this.changeDetectorRef.detectChanges();

    if (this.isAnimationPlaying = true) {
      this.isAnimationPlaying = false
      this.stopSlideshow(videoId)
    }

    this.getLoggedInUser()

    if (selectedVideo) {

      this.selectedThumbs = selectedVideo.thumbs; // Assign the correct 15 thumbnails
      selectedVideo.isAnimationPlaying = true; // Set animation state for the specific video
      this.currentThumbIndex = 0;
      // console.log('Selected Thumbnails:', this.selectedThumbs, selectedVideo); // For debugging
      console.log(selectedVideo)

      // Cycle through thumbnails every 500ms
      this.slideshowInterval = setInterval(() => {
        this.currentThumbIndex = (this.currentThumbIndex + 1) % this.selectedThumbs.length;
      }, 700);
    }
  }

  selectedFav(videoId: string) {
    const clickedVideo = this.adult.find(video => video.videoId === videoId);
    if (clickedVideo) {
      this.changeDetectorRef.detectChanges();

      this.favVideo = clickedVideo;
      console.log("you clicked on it: ", clickedVideo)
    } else {
      console.log('not found')
    }
  }
  // Stop showing thumbnails when the mouse leaves
  stopSlideshow(videoId: string) {
    const selectedVideo = this.adult.find(video => video.videoId === videoId);
    this.isAnimationPlaying = false
    if (selectedVideo) {
      selectedVideo.isAnimationPlaying = false; // Stop animation for the specific video
      clearInterval(this.slideshowInterval);
    }
  }
}