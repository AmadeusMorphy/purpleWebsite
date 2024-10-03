import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class
  ImageSlideshowService {
  private adult: {
    imgUrl: string;
    videoUrl: string;
    title: string;
    views: number;
    length: number;
    thumbnail: string;
    thumbs: { src: string; }[];
  }[] = [];

  getAdultData(): Observable<{
    imgUrl: string;
    videoUrl: string;
    title: string;
    views: number;
    length: number;
    thumbnail: string;
    thumbs: { src: string; }[];
  }[]> {
    return of(this.adult);
  }
}