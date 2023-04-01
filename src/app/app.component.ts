import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  link = 'https://github.com/sunrose3/keyboard';
  title = 'keyboard';

  value = "";
  value1 = "";
  value2 = "";
  value3 = "";

  onChange(string: string | number) {
    console.log(string);
    this.value = this.value+string;
  }
  onChange1(string: string | number) {
    console.log(string);
    this.value1 += string;
  }
  onChange2(string: string | number) {
    console.log(string);
    this.value2 += string;
  }
  onChange3(string: string | number) {
    console.log(string);
    this.value3 += string;
  }
}
