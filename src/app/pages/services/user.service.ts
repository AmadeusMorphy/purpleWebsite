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

  updatePlaylist(userId: string, newPlaylistItem: string): Observable<any> {
    return this.getUser(userId).pipe(  // Get the user first
      switchMap(user => {
        // Concatenate the new item to the existing playlist
        const updatedPlaylist = user.playlist ? user.playlist.concat(newPlaylistItem) : [newPlaylistItem];
        return this.http.patch<any>(`${this.apiUrl}/${userId}`, { playlist: updatedPlaylist });
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
}
