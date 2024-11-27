import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/signIn/signIn.component';
import { NewComponent } from './pages/new/new.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ExploreComponent } from './pages/explore/explore.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'new', component: NewComponent },
  { path: 'wishlist', component: WishlistComponent }
];
