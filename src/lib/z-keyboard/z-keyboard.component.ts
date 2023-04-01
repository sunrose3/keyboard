import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, EventEmitter, Injector, Input, OnInit, Output, ViewRef } from '@angular/core';
import { Options, Parent } from '../utils/input';
import { NumericKeyboardComponent } from './keyboard/keyboard.component';
import { Layout, LayoutsType } from '../utils/layouts';

@Component({
  selector: 'z-keyboard',
  templateUrl: './z-keyboard.component.html',
  styleUrls: ['./z-keyboard.component.scss']
})
export class ZKeyboardComponent extends Parent implements OnInit {

  @Input() isInteger: boolean = true;//是否为整数
  @Input() isNegative: boolean = false;//是否为负数
  @Input() entertext: string = Options.entertext;
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() enterpress = new EventEmitter();
  @Output() ngModelChange = new EventEmitter<number | string>();

  private _value: number | string = Options.value;

  _onChange = (_: any) => { };

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    super();
  }
  ngOnInit() {
    if (this.isInteger && this.isNegative) this.layout = "negativeNumber";//整数 为负数
    if (!this.isInteger && this.isNegative) this.layout = "negativeDecimals";//小数为负数
    if (this.isInteger && !this.isNegative) this.layout = "number";//整数 不为负数
    if (!this.isInteger && !this.isNegative) this.layout = "decimals";//小数 不为负数
    const resolvedOptions = {};
    for (const key in Options) {
      resolvedOptions[key] = this[key];
    }
    this.init.call(this, resolvedOptions);
  }

  onChange(value: number | string) {
    this.ngModelChange.emit(value);
  }

  ngOnDestroy() {
    this.destroy.call(this)
  }

  writeValue(value: any): void {
    if (typeof value === undefined || value === null) {
      this._value = '';
    } else {
      this._value = value;
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void { }


  override dispatch(event: string, payload?: number | string) {
    switch (event) {
      case 'focus':
        this.focus.emit();
        break;
      case 'blur':
        this.blur.emit();
        break;
      case 'enterpress':
        this.enterpress.emit();
        break;
      case 'input':
        this.ngModelChange.emit(payload);
        break;
    }
  }

  override createKeyboard(el, options, events, callback) {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(NumericKeyboardComponent)
      .create(this.injector);

    Object.assign(componentRef.instance, options);

    componentRef.instance.ngOnInit();

    for (const event in events) {
      componentRef.instance[event].subscribe(events[event]);
    }

    this.appRef.attachView(componentRef.hostView);
    const element = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    el.appendChild(element);

    callback(componentRef);
  }

  override destroyKeyboard(el, keyboard) {
    keyboard.destroy();
    this.appRef.detachView(keyboard.hostView);
  }
}

export interface InputOptions {
  layout: keyof LayoutsType | Layout;
  entertext: string;
}