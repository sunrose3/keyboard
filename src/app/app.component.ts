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

  value: number;
  value0: number;
  value1: number;
  value2: number;
  value3: number;
  @ViewChild('input', { static: true, read: ElementRef }) input!: ElementRef<HTMLInputElement>;
  @ViewChild('input1', { static: true, read: ElementRef }) input1!: ElementRef<HTMLInputElement>;
  @ViewChild('input2', { static: true, read: ElementRef }) input2!: ElementRef<HTMLInputElement>;
  @ViewChild('input3', { static: true, read: ElementRef }) input3!: ElementRef<HTMLInputElement>;
  constructor(private keyboardService: KeyboardService) { }

  ngOnInit(): void {
    this.keyboardService.registerInput(this.input.nativeElement.querySelector('input'), false, true, {
      layout: 'number'
    });
    this.keyboardService.registerInput(this.input1.nativeElement.querySelector('input'), true, true, {
      layout: 'number'
    });

    this.keyboardService.registerInput(this.input2.nativeElement.querySelector('input'), false, false, {
      layout: 'number'
    });
    this.keyboardService.registerInput(this.input3.nativeElement.querySelector('input'), true, false, {
      layout: 'number'
    });
  }
}
