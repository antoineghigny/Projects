import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StoreSelectionComponent} from "./store-selection/store-selection.component";

const routes: Routes = [
  // { path: 'store-selection', component: StoreSelectionComponent },
  { path: '', component: StoreSelectionComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
