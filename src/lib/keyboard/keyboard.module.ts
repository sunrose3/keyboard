import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumericKeyboardComponent } from './keyboard.component';
import { KeyboardDirective } from './keyboard.directive';
import { KeyboardService } from './keyboard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [NumericKeyboardComponent,
    KeyboardDirective],
  exports: [ NumericKeyboardComponent,
    KeyboardDirective],
  providers: [KeyboardService]
})
export class KeyboardModule { }
