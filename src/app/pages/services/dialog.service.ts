import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private loginDialogSubject = new BehaviorSubject<boolean>(false);
    private signUpDialogSubject = new BehaviorSubject<boolean>(false);

    loginDialog$ = this.loginDialogSubject.asObservable();
    signUpDialog$ = this.signUpDialogSubject.asObservable();

    openLoginDialog() {
        this.loginDialogSubject.next(true);
    }

    closeLoginDialog() {
        this.loginDialogSubject.next(false);
    }

    openSignUpDialog() {
        this.signUpDialogSubject.next(true);
    }

    closeSignUpDialog() {
        this.signUpDialogSubject.next(false);
    }
}
