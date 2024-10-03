import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  searchQuery: string = '';

  adult: {
    videoId: string,
    imgUrl: string,
    videoUrl: string,
    title: string,
    views: number,
    length: number,
    thumbs: string[],
    isAnimationPlaying: boolean;  // Updated thumbs to store string URLs of thumbnails
  }[] = [];


  changePage: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAdult(this.searchQuery)
  }

  getAdult(query: string) {
    const adultApi = `https://www.eporner.com/api/v2/video/search/?query=${this.searchQuery}&per_page=100&page=${this.changePage}&thumbsize=big&order=top-weekly&gay=0&lq=1&format=json`;

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
            thumbs: item.thumbs.map((thumb: any) => thumb.src) // Extract all thumbnails
          };
        });
        console.log(this.adult)
      },
      (error) => {
        console.error("Failed to fetch videos:", error);
      }
    );
  }


  onSearch(query: string) {
    // Perform any necessary query manipulation here
    const modifiedQuery = query.trim().toLowerCase(); // Example: Trim and lowercase

    this.searchQuery = query;
    console.log(this.searchQuery);

    this.searchQuery = modifiedQuery;
    this.getAdult(modifiedQuery);
  }

  updateSearch(query: string) {
    this.onSearch(query);
  }

}
