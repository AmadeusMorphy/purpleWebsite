import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent {

  constructor(private http: HttpClient) { }

  pics: {
    imgUrl: string,
    title: string
  }[] = []
  pics2: {
    imgUrl: string,
    title: string
  }[] = []
  pics3: {
    imgUrl: string,
    title: string
  }[] = []
  pics4: {
    imgUrl: string,
    title: string
  }[] = []

  imgDialog: boolean = false;
  selectedImageUrl: string = ''


  ngOnInit() {
    this.getPics2()
    this.getPics3()
    this.getPics4()
    this.getPics()
  }



  getPics() {

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics = res.data.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n
          }
        })
        console.log(this.pics)
      }
    )
  }

  getPics2() {

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics2 = res.data_b.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n
          }
        })
        console.log(this.pics2)
      }
    )
  }
  getPics3() {

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics3 = res.data_i.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n
          }
        })

        console.log(this.pics3)
      }
    )
  }
  getPics4() {

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics4 = res.data_j.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n
          }
        })

        console.log(this.pics4)
      }
    )
  }
}
