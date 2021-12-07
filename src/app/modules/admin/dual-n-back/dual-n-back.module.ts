import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DualNBackRoutingModule } from './dual-n-back-routing.module';
import { DualNBackComponent } from './dual-n-back.component';


@NgModule({
  declarations: [
    DualNBackComponent
  ],
  imports: [
    CommonModule,
    DualNBackRoutingModule
  ]
})
export class DualNBackModule { }
