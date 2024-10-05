import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from './pages/services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './pages/services/user.service';
import { FunctionsService } from './pages/services/functions.service';
import { query } from '@angular/animations';

function generateUniqueId() {
  return btoa(Date.now().toString() + Math.random().toString(36).substring(2, 15));
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  display: boolean = false
  items: MenuItem[] | undefined;
  sideItems: MenuItem[] = [];
  userItems: MenuItem[] | undefined;

  signUpForm: FormGroup;
  signInForm: FormGroup;
  errorMessage: string = '';

  userName: any;
  userLength: any;

  isLoggedIn: boolean = false;
  lastScrollTop = 0;
  isHidden = false;
  visible: boolean = false;
  isLoading: boolean = false;

  showLoginDialog: boolean = false;
  showSignUpDialog: boolean = false;
  loginForm!: FormGroup;

  userImg: string = ''
  query: string = '';

  loggedOutItems: MenuItem[] = [
    {
      label: 'Log In',
      icon: 'pi pi-user',
      command: () => this.dialogService.openLoginDialog()
    },
    {
      label: 'Sign Up',
      icon: 'pi pi-user-plus',
      command: () => this.dialogService.openSignUpDialog()
    }
  ];

  loggedInItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateToProfile()
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.navigateToSettings()
    },
    {
      label: 'Favorites',
      icon: 'pi pi-heart',
      command: () => this.navigateToFavorites()
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  userLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    // private homeCom: HomeComponent,
    private fb: FormBuilder,
    private userService: UserService,
    private functionsService: FunctionsService) {

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signUpForm = this.fb.group({
      id: [generateUniqueId()],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      playlist: [],
      DateJoined: [new Date()]
    });
  }

  @Output() searchUpdated = new EventEmitter<string>();
  @HostListener('keyup.enter', ['$event'])
  onSearchInput(event: KeyboardEvent) {
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement; // Get the input element
    const query = inputElement.value; // Get the search query
    this.searchUpdated.emit(query);  // Emit the search query (optional)
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 100) {

      this.isHidden = true;

    } else {

      this.isHidden = false;

    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
  }

  ngOnInit(): void {
    document.body.style.overflow = 'auto';

    // this.userLoggedIn = this.authService.isLoggedIn();
    this.checkUserLoggedIn()

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/home'
      },
      {
        label: 'Pictures',
        icon: 'pi pi-images',
        routerLink: '/pictures'
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        routerLink: '/favorites'
      },
    ];

    this.dialogService.loginDialog$.subscribe(show => {
      this.showLoginDialog = show;
    });

    this.dialogService.signUpDialog$.subscribe(show => {
      this.showSignUpDialog = show;
    });

    this.updateMenuItems();

    this.userItems = [
      {
        label: 'Do stuff',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-user',
            command: () => this.dialogService.openLoginDialog()
          },
          {
            label: 'Sign Up',
            icon: 'pi pi-user-plus',
            command: () => this.dialogService.openSignUpDialog()
          }
        ]
      }
    ];
    //   {
    //     label: 'File',
    //     icon: 'pi pi-pw pi-file',
    //   },
    //   {
    //     label: 'Edit',
    //     icon: 'pi pi-fw pi-pencil',
    //   },
    //   {
    //     label: 'Help',
    //     icon: 'pi pi-fw pi-question'
    //   },
    //   {
    //     label: 'Actions',
    //     icon: 'pi pi-fw pi-cog',
    //   }
    // ];

  }

  toggleBodyScroll() {
    // When showLoginDialog changes, disable or enable body scroll
    if (this.showLoginDialog || this.showSignUpDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  openSidebar() {
    this.showLoginDialog = true;
    this.toggleBodyScroll();  // Disable scroll when opening
  }

  closeSidebar() {
    this.showLoginDialog = false;
    this.toggleBodyScroll();  // Enable scroll when closing
  }

  onClosLogIn() {
    this.dialogService.closeLoginDialog()
  }

  onSignUp(): void {
    this.isLoading = true;
    if (this.signUpForm.valid) {
      this.userService.signUp(this.signUpForm.value).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.dialogService.closeSignUpDialog(); // Close the dialog
          this.dialogService.openLoginDialog()
          console.log('user signed up successfully: ', res)
        }, (error) => {
          console.error('didnt work', error)
        }
      )
    }
  }
  onSearch(searchQuery: string) {
    this.functionsService.getAdult(searchQuery);
  }

  checkUserLoggedIn() {
    const userData = localStorage
    const user = localStorage.getItem('userId');
    const UserName = localStorage.getItem('username')
    this.userName = UserName
    console.log(localStorage)
    this.userLoggedIn = user !== null;
    console.log(this.userLoggedIn)
    if (user) {

      this.userService.getUser(user).subscribe(
        (res: any) => {
          this.userLength = res.profileImg?.length
          this.userImg = res.profileImg[0];
          console.log("Manual Service Response: ", res)
        }
      )
      this.userLoggedIn == true;
      console.log("You are logged in as: ", user);
    } else {
      this.userLoggedIn == false;
      this.router.navigate(['/home']);

      console.error("You're not logged in")
    }
  }

  updateMenuItems() {
    this.sideItems = this.userLoggedIn ? this.loggedInItems : this.loggedOutItems;
  }

  login() {
    this.isLoading = true;
    const { email, password } = this.signInForm.value;

    this.userService.signIn(email, password).subscribe(
      (response) => {
        this.isLoggedIn = true;
        if (response.length > 0) {
          this.isLoading = false
          window.location.reload()
          // Assuming the response contains user data
          const user = response[0]; // Get the first matched user
          localStorage.setItem('userId', user.id);
          localStorage.setItem('username', user.username);

          this.dialogService.closeLoginDialog();
          this.userLoggedIn = true; // Update login status
          this.updateMenuItems();
          this.checkUserLoggedIn()
          console.log('You Logged in: ', user)
        } else {
          this.isLoading = false
          console.error('Invalid email or password');
        }
      },
      (error) => {
        this.isLoading = false
        console.error('Error during sign-in', error);
      }
    );
  }


  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('userId'); // Remove user data
    this.userLoggedIn = false; // Update login status
    this.updateMenuItems(); // Update menu items back to logged-out version

    window.location.reload()
  }

  navigateToProfile() {
    // Logic to navigate to the profile page
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    // Logic to navigate to the settings page
    this.router.navigate(['/settings']);
  }

  navigateToFavorites() {
    this.router.navigate(['./favorites'])
  }

  loginDialog() {
    this.visible = true
  }

}
