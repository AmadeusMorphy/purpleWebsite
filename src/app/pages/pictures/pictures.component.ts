import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent {

  constructor(
    private http: HttpClient, 
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService
  ) { }

  pics: {
    imgUrl: string,
    title: string,
    id: string
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

  favImg: any;

  imgDialog: boolean = false;
  selectedImageUrl: string = ''
  loggedInUser: any = {};
  currentUserId: any;



  ngOnInit() {
    this.getPics2()
    this.getPics3()
    this.getPics4()
    this.getPics()
  }



  getPics() {

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res)

        this.pics = res.data.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n,
            id: item.id
          }
        })
        console.log(this.pics)
      }
    )
  }

  checkUserLoggedIn() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user
    this.loggedInUser = !!user;

    console.log(this.loggedInUser)
    if (user) {
      this.loggedInUser == true;
      console.log("You are logged in as: ", this.currentUserId);
    } else {
      this.loggedInUser == false;
      console.error("You're not logged in")
    }// Check if user data exists
  }

  selectedFav(id: string) {
    const clickedImg = this.pics.find(image => image.id === id);
    if (clickedImg) {

      this.changeDetectorRef.detectChanges();

      this.favImg = clickedImg;
      console.log("you clicked on it: ", clickedImg)
    } else {
      console.log('not found')
    }
  }

  putImgDb() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user
    const newFav = this.favImg

    if (this.loggedInUser) {
      this.userService.updateImages(this.currentUserId, newFav).subscribe(
        (updateUs) => {
          console.log('ADDED TO THE DB: ', updateUs);
          this.loggedInUser = updateUs;

},
        (error) => {
          console.error('Error Bitch: ', error)
        }
      );
    } else {

      console.error('No user found')
    }

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
