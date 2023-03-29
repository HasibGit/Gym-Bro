import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [AuthComponent, SignUpComponent, LoginComponent],
  imports: [SharedModule, AngularFireAuthModule, AuthRoutingModule],
})
export class AuthModule {}
