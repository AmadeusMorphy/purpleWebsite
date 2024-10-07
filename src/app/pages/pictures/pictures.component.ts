import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent {

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private messsageService: MessageService
  ) { }

  pics: {
    imgUrl: string,
    title: string,
    id: string
  }[] = []
  pics2: {
    imgUrl: string,
    title: string,
    id: string
  }[] = []
  pics3: {
    imgUrl: string,
    title: string,
    id: string
  }[] = []
  pics4: {
    imgUrl: string,
    title: string,
    id: string
  }[] = []

  favImg: any;

  imgDialog: boolean = false;
  selectedImageUrl: string = ''
  loggedInUser: any = {};
  currentUserId: any;
  isLoading: boolean = false;


  ngOnInit() {
    this.getPics()
    this.getPics2()
    this.getPics3()
    this.getPics4()

    console.log('refreshed? ', this.pics3)
  }



  getPics() {

    this.isLoading = true;

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
        this.isLoading = false
      }, (error) => {
        this.isLoading = false;
        console.log('Error fetching data: ', error);
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
    } else {
      this.loggedInUser == false;
      console.error("You're not logged in")
    }// Check if user data exists
  }

  selectedFav(id: string) {
    const clickedImg = this.pics.find(image => image.id === id);
    const clickedImg2 = this.pics2.find(image => image.id === id);
    const clickedImg3 = this.pics3.find(image => image.id === id);
    const clickedImg4 = this.pics4.find(image => image.id === id);
    if (clickedImg) {
      this.changeDetectorRef.detectChanges();
      this.favImg = clickedImg;
      console.log("you clicked on it: ", clickedImg)
    } else if (clickedImg2) {
      this.changeDetectorRef.detectChanges();
      this.favImg = clickedImg2;
      console.log("you clicked on it: ", clickedImg2)
    } else if (clickedImg3) {
      this.changeDetectorRef.detectChanges();
      this.favImg = clickedImg3;
      console.log("you clicked on it: ", clickedImg3)
    } else if (clickedImg4) {
      this.changeDetectorRef.detectChanges();
      this.favImg = clickedImg4;
      console.log("you clicked on it: ", clickedImg4)
    } else {
      console.log("Not found")
    }
  }

  putImgDb() {
    const user = localStorage.getItem('userId');
    this.currentUserId = user
    const newFav = this.favImg

    if (this.loggedInUser) {
      this.userService.updateImages(this.currentUserId, newFav).subscribe(
        (updateUs) => {
          this.messsageService.add({ severity: 'success', summary: 'Image Added!', icon: 'pi pi-heart', detail: 'Its now in your favorites' });

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


  // getPics2() {
  //   this.isLoading = true;

  //   this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
  //     (res: any) => {
  //       console.log('FREE API:', res.data.map((item: any) => item.t));

  //       // Process multiple data sets using a helper function
  //       this.pics2 = this.processData(res.data); // First dataset
  //       const pics = this.processData(res.data_j); // First dataset
  //       const picsI = this.processData(res.data_i); // Third dataset
  //       const picsB = this.processData(res.data_b); // Third dataset

  //       // Combine the pics if needed or handle them separately
  //       this.pics2 = [...this.pics2, ...pics, ...picsI, ...picsB];

  //       this.isLoading = false;
  //       console.log(this.pics2);
  //     }
  //   );
  // }

  // processData(dataSet: any[]): any[] {
  //   return dataSet.map((item: any) => {
  //     return {
  //       imgUrl: item.t,
  //       title: item.n,
  //       id: item.id
  //     };
  //   });
  // }


  getPics2() {
    this.isLoading = true

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics2 = res.data_b.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n,
            id: item.id
          }
        })
        this.isLoading = false
      }
    )
  }
  getPics3() {
    this.isLoading = true

    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics3 = res.data_i.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n,
            id: item.id
          }
        })
        this.isLoading = false
      }
    )
  }
  getPics4() {

    this.isLoading = true;
    this.http.get('https://www.pornpics.com/additional_thumbs?mix=1&langs=en-US&code=jo').subscribe(
      (res: any) => {
        console.log('FREE API: ', res.data.map((item: any) => item.t))

        this.pics4 = res.data_j.map((item: any) => {
          return {
            imgUrl: item.t,
            title: item.n,
            id: item.id
          }
        })
        this.isLoading = false
        console.log('Refreshed" :', this.pics4)
      }
    )
  }
}
