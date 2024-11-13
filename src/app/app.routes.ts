import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },        // 기본 경로에 홈 컴포넌트 연결
  { path: 'login', component: LoginComponent }   // /login 경로에 로그인 컴포넌트 연결
];
