import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-friend-req',
  templateUrl: './friend-req.component.html',
  styleUrls: ['./friend-req.component.scss']
})
export class FriendReqComponent {

  constructor(
    private userService: UserService
  ) { }

  isLoading: boolean = false;

  currentUserId: any
  friendReqs: {
    username: string,
    profileImg: string,
    email: string,
    id: string,
    isAccept: boolean
  }[] = []
  currrentUser!: {
    username: string,
    profileImg: string,
    email: string,
    id: string,
  }

  selectedUser!: string;
  isAccept: boolean = false;
  requesterId: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.getReqs()
  }

  getReqs() {
    this.isLoading = true;
    this.currentUserId = localStorage.getItem('userId')


    this.userService.getCurrentUser(this.currentUserId).subscribe(
      (res: any) => {
        console.log('current user: ', res)

        this.currrentUser = {
          username: res.username,
          profileImg: res.profileImg[0],
          email: res.email,
          id: res.id
        };

        this.requesterId = res.friendRequests?.map((item: any) => item.id);

        this.friendReqs = res.friendRequests?.map((item: any) => {
          return {
            username: item.username,
            profileImg: item.profileImg[0],
            email: item.email,
            id: item.id
          }
        })
        this.isLoading = false
        console.log(this.friendReqs)
      }, (error) => {
        console.log('error stuff: ', error)
        this.isLoading = false
      }
    )
  }

  onAccept(index: number) {
    this.friendReqs[index].isAccept = true;
    this.selectedUser = this.friendReqs[index].id;

    this.userService.acceptFriendReq(this.currentUserId, this.friendReqs[index]).subscribe(
      (res: any) => {
        console.log('Friend request accepted: ', res);



        // After accepting, remove the friend request from `friendRequests`
        this.userService.removeFriendReq(this.currentUserId, this.selectedUser).subscribe(
          (res: any) => {
            console.log("User removed from requests: ", res);

            // Optionally, remove the request from the local `friendReqs` array
            // Remove the accepted request from the UI
          }
        );
        this.userService.acceptFriendReq(this.requesterId, this.currrentUser).subscribe(
          (res: any) => {
            console.log('the requester is fiends with u too: ', res)
          }
        )
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  onSendReq(index: number) {

    this.friendReqs[index].isAccept = true
    console.log(this.friendReqs[index])
  }



}
