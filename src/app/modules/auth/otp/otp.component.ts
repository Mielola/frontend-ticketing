import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { OtpInputComponent } from 'app/modules/component/otp-input/otp-input.component';
import { ApiService } from 'app/services/api.service';
import { UserService } from 'app/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule, OtpInputComponent],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {

  @HostBinding('class') className = 'w-full';
  data = '';
  email: String


  constructor(
    private cookieService: CookieService,
    private apiService: ApiService,
    private toast: ToastrService,
    private auth: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _httpClient: HttpClient,
    private _cookies: CookieService,
    private _userService : UserService,
  ) { }

  ngOnInit(): void {
    this.email = this.cookieService.get("otp-email")
  }

  async onSubmit() {
    try {
      const { data, status } = await this.apiService.post("api/V1/verify-otp", {
        email: this.email,
        otp: this.data
      })

      if (status === 401) {
        // If OTP Error
        this.toast.error("The OTP you entered is incorrect. Please try again.", "Invalid OTP");
        return
      } else if (status === 500) {
        // If Internal Server Error
        this.toast.error("Internal Server Error.", "Internal Error");
        return
      } else if (status === 200 ) {
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem("accessToken", data.user.token)
        
        this._userService.Update(data.user)
        
        this._cookies.deleteAll("/")
      }

      const redirectURL =
        this._activatedRoute.snapshot.queryParamMap.get(
          'redirectURL'
        ) || '/signed-in-redirect';

      this._router.navigateByUrl(redirectURL);
    } catch (error) {
      throw error
    }
  }
}
