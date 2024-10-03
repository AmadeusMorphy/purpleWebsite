import { TestBed } from '@angular/core/testing';

import { ImageSlideshowService } from './image-slideshow.service';

describe('ImageSlideshowService', () => {
  let service: ImageSlideshowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageSlideshowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
