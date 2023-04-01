import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZKeyboardModule } from 'src/lib/z-keyboard/z-keyboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ZKeyboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
