import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { PicturesComponent } from './pages/pictures/pictures.component';
import { VideosComponent } from './pages/favorites/videos/videos.component';
import { ImagesComponent } from './pages/favorites/images/images.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { FriendReqComponent } from './pages/friend-req/friend-req.component';
import { AddFriendComponent } from './pages/add-friend/add-friend.component';
import { InboxComponent } from './pages/inbox/inbox.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'pictures', component: PicturesComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'friendReq', component: FriendReqComponent },
  { path: 'addFriend', component: AddFriendComponent },
  { path: 'inbox', component: InboxComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
