import {
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { KeyboardRef } from './keyboard-ref';
import { Layout, LayoutsType } from '../utils/layouts';

@Directive({
  selector: 'input[ngKeyboard],textarea[ngKeyboard],p-inputNumber[ngKeyboard]'
})
export class KeyboardDirective implements OnInit {
  @Input() entertext: string = 'Enter';

  @Input() isInteger: boolean = true;//是否为整数
  @Input() isNegative: boolean = false;//是否为负数

   layout: keyof LayoutsType | Layout = 'number';
  private keyboardRef: KeyboardRef;
  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>
  ) {}

  ngOnInit(): void {
    if (this.isInteger && this.isNegative) this.layout = "negativeNumber";//整数 为负数
    if (!this.isInteger && this.isNegative) this.layout = "negativeDecimals";//小数为负数
    if (this.isInteger && !this.isNegative) this.layout = "number";//整数 不为负数
    if (!this.isInteger && !this.isNegative) this.layout = "decimals";//小数 不为负数
    this.keyboardRef = new KeyboardRef(this.elementRef, this.appRef, this.componentFactoryResolver, this.injector);
  }

  @HostListener('focus', ['$event'])
  handleFocus(event: MouseEvent): void {
    this.keyboardRef.openKeyboard({ layout: this.layout, entertext: this.entertext });
  }

  @HostListener('touchend', ['$event'])
  handleTouchend(event: MouseEvent): void {
    this.handleFocus(event);
  }
}
