import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://66fbddf48583ac93b40d8ce0.mockapi.io/users/login';

  constructor(private http: HttpClient) { }

  signUp(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}&password=${password}`);
  }

  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  getAllusers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`)
  }

  getCurrentUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`)
  }

  updatePlaylist(userId: string, newPlaylistItem: string): Observable<any> {
    return this.getUser(userId).pipe(  // Get the user first
      switchMap(user => {
        // Concatenate the new item to the existing playlist
        const updatedPlaylist = user.playlist ? user.playlist.concat(newPlaylistItem) : [newPlaylistItem];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { playlist: updatedPlaylist });
      })
    );
  }
  updateImages(userId: string, newImageItem: string): Observable<any> {
    return this.getUser(userId).pipe(  // Get the user first
      switchMap(user => {
        // Concatenate the new item to the existing playlist
        const updateImages = user.images ? user.images.concat(newImageItem) : [newImageItem];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { images: updateImages });
      })
    );
  }

  uploadImage(userId: string, newProfileImage: string): Observable<any> {
    return this.getUser(userId).pipe(  // Get the user first
      switchMap(user => {
        // Concatenate the new item to the existing playlist
        const updatedImg = user.profileImg ? user.profileImg.concat(newProfileImage) : [newProfileImage];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { profileImg: updatedImg });
      })
    );
  }

  deleteImage(userId: string, imageUrl: string): Observable<any> {
    return this.getUser(userId).pipe(  // Get the user first
      switchMap(user => {
        // Filter out the image to be deleted from the profileImg array
        const updatedImg = user.profileImg ? user.profileImg.filter((img: string) => img !== imageUrl) : [];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { profileImg: updatedImg });
      })
    );
  }

  deleteVideoFromPlaylist(userId: string, videoToDeleteId: string): Observable<any> {
    return this.getUser(userId).pipe(
      switchMap(user => {
        console.log('Current Playlist:', user.playlist);
        console.log('Video ID to Delete:', videoToDeleteId);

        // Filter out the video object with the matching videoId
        const updatedPlaylist = user.playlist ? user.playlist.filter((video: { videoId: string; }) => video.videoId !== videoToDeleteId) : [];

        console.log('Updated Playlist:', updatedPlaylist);

        return this.http.put<any>(`${this.apiUrl}/${userId}`, { ...user, playlist: updatedPlaylist }).pipe(
          tap((updatedUser: any) => {
            console.log('Response from DB after update:', updatedUser);
          })
        );

      }
      ))
  }

  sendFriendReq(userId: string, newFriendReq: { username: string, profileImg: string, email: string, id: string }): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        // Ensure we are appending the new friend request to the existing ones
        const sendReq = user.friendRequests ? [...user.friendRequests, newFriendReq] : [newFriendReq];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { friendRequests: sendReq });
      })
    );
  }

  removeFriendReq(userId: string, friendReq: string): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        const updatedFriendReq = user.friendRequests ? user.friendRequests.filter((req: { id: string }) => req.id !== friendReq) : [];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { ...user, friendRequests: updatedFriendReq }).pipe(
          tap((updatedFriendReq: any) => {
            console.log('Friend req removed: ', updatedFriendReq)
          })
        )
      })
    )
  }
  removeFriend(userId: string, friend: string): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        const updateFriends = user.friends ? user.friends.filter((req: { id: string }) => req.id !== friend) : [];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { ...user, friends: updateFriends }).pipe(
          tap((updateFriends: any) => {
            console.log('Friend req removed: ', updateFriends)
          })
        )
      })
    )
  }
  acceptFriendReq(userId: string, acceptReq: { username: string, profileImg: string, email: string, id: string }): Observable<any> {
    return this.getCurrentUser(userId).pipe(
      switchMap(user => {
        // Ensure `user.friends` is always an array
        const friends = user.friends ? [...user.friends, acceptReq] : [acceptReq];
        return this.http.put<any>(`${this.apiUrl}/${userId}`, { friends });
      })
    );
  }

}
