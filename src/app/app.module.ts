import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PicturesComponent } from './pages/pictures/pictures.component';
import { NumberFormatPipe } from './number-format.pipe';
import { ImageModule } from 'primeng/image';
import { VideosComponent } from './pages/favorites/videos/videos.component';
import { ImagesComponent } from './pages/favorites/images/images.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AddFriendComponent } from './pages/add-friend/add-friend.component';
import { FriendReqComponent } from './pages/friend-req/friend-req.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { InboxComponent } from './pages/inbox/inbox.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FavoritesComponent,
    PicturesComponent,
    NumberFormatPipe,
    VideosComponent,
    ImagesComponent,
    ProfileComponent,
    AddFriendComponent,
    FriendReqComponent,
    FriendsComponent,
    InboxComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterOutlet,
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    PaginatorModule,
    MenubarModule,
    FormsModule,
    AvatarModule,
    BadgeModule,
    BrowserAnimationsModule,
    RippleModule,
    SidebarModule,
    PanelMenuModule,
    MenuModule,
    DialogModule,
    ChipModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    ProgressSpinnerModule,
    ToastModule,
    ImageModule,
    FileUploadModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

