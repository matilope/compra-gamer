import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@shared/services/register.service';
import { User } from '@core/models/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly _userService: UserService = inject(UserService);
  public user!: User;
  public formGroup: FormGroup = new FormGroup({});
  private subscription!: Subscription;
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.formGroup = new FormGroup(
      {
        nombre: new FormControl('', [
          Validators.required,
          Validators.maxLength(120)
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.maxLength(120)
        ]),
        dni: new FormControl('', [
          Validators.required,
          Validators.max(99_999_999)
        ]),
        correo: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        telefono: new FormControl('', [
          Validators.required,
          Validators.maxLength(14)
        ])
      }
    );
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action);
  }

  onSubmit(): void {
    const { nombre, apellido, dni, correo, telefono } = this.formGroup.value;
    this.subscription = this._userService.save({ nombre, apellido, dni, correo, telefono }).subscribe({
      next: (response: string) => {
        console.log(response);
        if (response === "Usuario guardado correctamente") {
          this.openSnackBar(response, "Ok");
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        } else {
          this.openSnackBar(response, "Ok");
        }
      },
      error: (err) => {
        // console.log(err);
        this.openSnackBar(err, "Ok");
      },
      complete: () => {
        // console.log("Se completo la subscripción");
        // No me gusta dejar console.logs en el código
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
