import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;
  inboxUsers: any[] = []; // Filtered users for the inbox (who have exchanged messages)
  friendsList: any[] = []; // Friends list for starting a new chat
  selectedReceiver: any = null;
  currentUserId: any;
  currentUserInfo: any = null;
  currentUser: any = null;
  showImageSelection: boolean = false; // To toggle the image selection modal
  selectedImage: string | null = null;
  newMessage: string = '';
  isMobile: boolean = false;
  showFriendsList: boolean = false; // Variable to toggle friends list visibility


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; // Set to true if the screen width is less than or equal to 768px
  }

  backToInbox() {
    this.selectedReceiver = null; // Reset selected user
  }

  // Get the current logged-in user info and their messages
  getCurrentUser() {
    this.isLoading = true;
    this.currentUserId = localStorage.getItem('userId');
    this.chatService.getUserById(this.currentUserId).subscribe((res: any) => {
      this.currentUser = res
      this.currentUserInfo = res.images.map((item: any) => item);
      console.log('this is it: ', this.currentUserInfo.images)
      this.getInboxUsers();
      this.getFriendsList(); // Get the friends list
      this.isLoading = false
    });
  }

  // Filter users who have exchanged messages with the current user
  getInboxUsers() {
    this.chatService.getUsers().subscribe((allUsers: any[]) => {
      this.inboxUsers = allUsers.filter(user => {
        // Check if the user has exchanged messages with the current user
        console.log(allUsers)
        const userName = localStorage.getItem('username')
        return user.messages && user.messages.some((msg: any) =>
        ((msg.receiverId == this.currentUserId && user.username != userName) ||
          (msg.senderId == this.currentUserId && user.username != userName))
        );
      });
      console.log('Inbox users: ', this.inboxUsers);
    });
  }

  // Get the friends list from the current user info
  getFriendsList() {

    this.friendsList = this.currentUser.friends || []; // Access the friends property
    console.log('Friends list: ', this.friendsList);
  }

  // Select the receiver to chat with and display messages
  selectUser(user: any) {
    this.selectedReceiver = user;

    // Ensure the selected user has messages or initialize an empty array
    if (!Array.isArray(this.selectedReceiver.messages)) {
      this.selectedReceiver.messages = [];
    }
  }

  // Method to start a new chat with a selected friend
  startNewChat(friend: any) {
    this.selectUser(friend); // Set the selected user to the friend
    this.showFriendsList = false; // Close the friends list after selecting a user
  }

  openImageSelection() {
    this.showImageSelection = true;
  }

  // Close the image selection modal
  closeImageSelection() {
    this.showImageSelection = false;
  }

  // Handle image selection
  selectImage(image: string) {
    this.selectedImage = image;
    this.showImageSelection = false; // Close the modal after selection
  }

  // Send a message to the selected receiver
  sendMessage() {
    if (!this.selectedReceiver) {
      console.error('No user selected to send message to');
      return;
    }

    const message = {
      senderId: this.currentUserId,
      receiverId: this.selectedReceiver.id,
      content: this.newMessage, // Message content
      timestamp: new Date().toISOString(),
      image: this.selectedImage // Include the selected image (if any)
    };

    // Push the message to the receiver's messages array
    this.selectedReceiver.messages.push(message);

    // Create a copy of the receiver's messages for backend update
    const updatedReceiverData = {
      ...this.selectedReceiver,
      messages: [...this.selectedReceiver.messages]
    };

    // Update the receiver's data in the backend
    this.chatService.updateUserMessages(this.selectedReceiver.id, updatedReceiverData).subscribe(
      (res) => {
        console.log('Message sent to receiver: ', res);

        // Also update the current user's messages
        const updatedCurrentUserData = {
          ...this.currentUser,
          messages: [...this.currentUser.messages, message]
        };

        this.chatService.updateUserMessages(this.currentUserId, updatedCurrentUserData).subscribe(
          (res: any) => {
            console.log('Current user message updated: ', res);
            this.newMessage = ''; // Clear the text input after sending
            this.selectedImage = null; // Clear the selected image after sending
          }
        );
      },
      (error) => {
        console.error('Error updating user messages: ', error);
      }
    );
  }

  // Filter messages to display only between current user and the selected receiver
  getFilteredMessages() {
    return this.selectedReceiver.messages.filter((msg: any) =>
      (msg.senderId === this.currentUserId && msg.receiverId === this.selectedReceiver.id) ||
      (msg.senderId === this.selectedReceiver.id && msg.receiverId === this.currentUserId)
    );
  }
}
