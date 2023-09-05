import {
  AfterViewInit,
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
} from '@angular/core';
import { KeyboardRef } from './keyboard-ref';
import { Layout, LayoutsType } from '../utils/layouts';

@Directive({
  selector: '[ngKeyboard]'
})
export class KeyboardDirective implements AfterViewInit {
  /**
   * 当前组件内的input控件选择器,通常是第三方组件包裹input,才需要使用此选择器
   */
  @Input() inputSelector?: string;
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

  ngAfterViewInit(): void {
    if (this.isInteger && this.isNegative) this.layout = "negativeNumber";//整数 为负数
    if (!this.isInteger && this.isNegative) this.layout = "negativeDecimals";//小数为负数
    if (this.isInteger && !this.isNegative) this.layout = "number";//整数 不为负数
    if (!this.isInteger && !this.isNegative) this.layout = "decimals";//小数 不为负数

    const inputElement = this.inputSelector? this.elementRef.nativeElement.querySelector<HTMLInputElement | HTMLTextAreaElement>(this.inputSelector): this.elementRef;
    if (!inputElement) {
      throw new Error('从当前元素中未找到 input 或 textarea控件');
    }
    this.keyboardRef = new KeyboardRef(inputElement, this.appRef, this.componentFactoryResolver, this.injector);
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
