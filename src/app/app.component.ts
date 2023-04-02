import { Component, ElementRef, ViewChild } from '@angular/core';
import { KeyboardService } from 'src/lib/keyboard/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  link = 'https://github.com/sunrose3/keyboard';
  title = 'keyboard';

  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;
  constructor(private keyboardService: KeyboardService) { }

  ngOnInit(): void {
    this.keyboardService.registerInput(this.input.nativeElement, {
      layout: 'number'
    });
  }
}
