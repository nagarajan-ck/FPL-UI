import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CupComponent } from './app/cup/cup.component';
import { AppComponent } from './app/app.component';

const routes: Routes = [
   { path: "/cup", component: CupComponent },
   { path: "**", component: AppComponent }

];
@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }