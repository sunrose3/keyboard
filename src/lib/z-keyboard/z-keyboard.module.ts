import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZKeyboardComponent } from './z-keyboard.component';
import { FormsModule } from '@angular/forms';
import { NumericKeyboardComponent } from './keyboard/keyboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ZKeyboardComponent, NumericKeyboardComponent],
  exports: [ZKeyboardComponent, NumericKeyboardComponent]
})
export class ZKeyboardModule { }
