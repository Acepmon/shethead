import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DualNBackComponent } from './dual-n-back.component';

const routes: Routes = [
  {
    path: '',
    component: DualNBackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DualNBackRoutingModule { }
