import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent {

  currentId: any;
  constructor(
    private userService: UserService
  ) { }

  isLoading: boolean = false;
  friends: {
    id: string,
    username: string,
    profileImg: string,
    email: string,
  }[] = []

  friend: any;
  isClicked: boolean = false;
  ngOnInit(): void {

    this.getFriends()
  }

  getFriends() {

    this.isLoading = true
    this.currentId = localStorage.getItem('userId')

    this.userService.getCurrentUser(this.currentId).subscribe(
      (res: any) => {
        this.isLoading = false
        console.log('Current user: ', res)
        console.log("friends: ", res.friends)

        this.friends = res.friends?.map((item: any) => {
          return {
            id: item.id,
            username: item.username,
            profileImg: item.profileImg,
            email: item.email,
          }
        })
        console.log(this.friends)
      }
    )
  }

  removeFriend(index: number) {

    this.isLoading = true

    this.userService.removeFriend(this.currentId, this.friends[index].id).subscribe(
      (res: any) => {
        this.isLoading = false
        console.log('Friend removed successfully: ', res)
        this.isClicked = true

        this.userService.removeFriend(this.friends[index].id, this.currentId).subscribe(
          (res: any) => {
            console.log('your also removed from their friends list', res)
          }
        )
      }
    )
  }

  onSendReq(index: number) {
    this.isLoading = true

    if (this.friends[index].id) {

      console.log(this.friends[index].id)
      this.friend = this.userService.getCurrentUser(this.friends[index].id).subscribe(
        (res: any) => {
          this.isLoading = false
          console.log('Your seeing his info: ', res)
        }
      )

    }
  }
}
