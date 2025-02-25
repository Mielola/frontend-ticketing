import { CommonModule } from '@angular/common';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CanComponentDeactivate } from 'app/core/auth/guards/can-deactive.guard';
import { User } from 'app/core/user/user.types';
import { ApiService } from 'app/services/api.service';
import { UserService } from 'app/services/userService/user.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButton, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {
  @HostBinding('class') className = 'w-full h-full bg-gradient-to-r from-blue-500 to-[#86C127]';
  user: User
  disabled: boolean = true
  editUserForm!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  isLoading : boolean = false


  constructor(
    private _userService: UserService,
    private fb: FormBuilder,
    private _apiService: ApiService,
    private _toast: ToastrService
  ) { }

  ngOnInit(): void {
    // Validator
    this.editUserForm = this.fb.group({
      name: [{ value: '', disabled: this.disabled }, Validators.required],
      email: [{ value: '', disabled: this.disabled }, Validators.required],
      avatar: [{ value: '', disabled: this.disabled }],
    });

    this._userService.user$.subscribe((users) => {
      if (users) {
        this.user = users;
        this.editUserForm.patchValue({
          name: users.name || '',
          email: users.email || '',
          avatar: '',
        });
      }
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Simpan di form control agar bisa dikirim
      this.editUserForm.patchValue({
        avatar: file
      });

      // Buat preview gambar
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  // Toggle Disabled State
  toggleEdit() {
    if (this.disabled) {
      this.editUserForm.enable();
    } else {
      this.editUserForm.disable();
    }
    this.disabled = !this.disabled;
  }

  async onSubmit() {
    try {
      this.isLoading = true
      const formData = new FormData();
      formData.append('name', this.editUserForm.get('name')?.value);
      formData.append('email', this.editUserForm.get('email')?.value);

      // Ambil file yang dipilih
      const avatarFile = this.editUserForm.get('avatar')?.value;
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const { data, status } = await this._apiService.post("api/V1/edit-profile", formData);
      console.log(data)

      if (status === 400) {
        this._toast.error("Email Already Used", "Email Already Used Broo");
        return;
      }

      if (status === 200) {
        this._userService.Update(data.data.user);
        this.toggleEdit();
      }
    } catch (error) {
      console.error(error);
      this._toast.error("Error", "Internal Server Error");
      throw error;
    } finally {
      this.isLoading = false
    }
  }


  // Cek apakah pengguna bisa keluar dari halaman
  canDeactivate(): boolean {
    if (!this.disabled) {
      return confirm('Anda sedang dalam mode edit. Apakah Anda yakin ingin meninggalkan halaman ini tanpa menyimpan perubahan?');
    }
    return true;
  }

}
