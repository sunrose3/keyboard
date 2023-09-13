import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector
} from '@angular/core';
import { KeyboardOptions, NumericKeyboardComponent } from './keyboard.component';
import { fromEvent, map, Subscription, timer } from 'rxjs';
import { ENTER } from '../utils/keys';
import { animate } from '../utils/utils';
import * as Keys from '../utils/keys';

export class KeyboardRef {
  private _activeInputElement!: HTMLInputElement | HTMLTextAreaElement | null;
  private keyboardElement!: HTMLDivElement;
  private keyboard: ComponentRef<NumericKeyboardComponent>;
  private touchend$: Subscription | null = null;

  constructor(
    private input: InputElement,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this._activeInputElement =
      (input as ElementRef<HTMLInputElement | HTMLTextAreaElement>).nativeElement ||
      (input as HTMLInputElement | HTMLTextAreaElement);
  }

  /**
   * Focus to input
   *
   * @private
   */
  private _focusActiveInput(): void {
    this._activeInputElement?.focus();
  }

  private handleButtonClicked(button: string): void {
    switch (button) {
      case Keys.BLANK:
        return;
      case Keys.ESC:
        this.closeKeyboard();
        return;
      case Keys.ENTER:

        this.closeKeyboard();
        return;
      case Keys.DEL:
        this.deleteChar(this._activeInputElement);
        break;
      default:
        this.insertChar(this._activeInputElement, button);
        break;
    }
    this._activeInputElement.dispatchEvent(new Event('change'));
  }

  private insertChar(input, text: string) {
    if (input) {
      this._focusActiveInput();
      const startPos = input.selectionStart;
      const endPos = input.selectionEnd;
      const oldValue = input.value;
      if (text == '-/+') {
        if (parseFloat(oldValue) >= 0 && oldValue.indexOf("-") == -1) {
          input.value = '-' + oldValue;
          input.setSelectionRange(startPos + 1, startPos + 1);
        } else {
          input.value = oldValue.replace("-", "");
          input.setSelectionRange(startPos - 1, startPos - 1);
        }
      } else {
        let newValue = oldValue.substring(0, startPos) + text + oldValue.substring(endPos);
        newValue = this.verification(newValue.split(""), text, startPos);
        let cursorPos = newValue.length - oldValue.length;
        if (text == "00") {
          input.value = newValue;
          input.setSelectionRange(startPos + cursorPos, startPos + cursorPos);
        }
        else {
          input.value = newValue;
          input.setSelectionRange(startPos + cursorPos, startPos + cursorPos);
        }
      }
    }
  }

  private deleteChar(input) {
    this._focusActiveInput();
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    if (startPos == endPos && startPos > 0) {
      const oldValue = input.value;
      input.value = oldValue.substring(0, startPos - 1) + oldValue.substring(endPos);
      input.setSelectionRange(startPos - 1, startPos - 1);
    } else {
      input.value = input.value.substring(0, startPos) + input.value.substring(endPos);
      input.setSelectionRange(startPos, startPos);
    }
  }

  //输入内容校验
  private verification(newRawValue, inputKey, cursorPos): string {
    let newValue = newRawValue.join('');
    let newValueArr = newRawValue;
    if (!/^-?\d*(?:\.\d*)?$/.test(newValue)) return '';
    newValue = parseFloat(newValue);
    newValueArr = newValue.toString().split("");
    const newValueString = newRawValue.join('');//下面有用的
    newValueArr = newValueString === "-" || newValueString === "-0"//保留'-'
      || inputKey === "." || newRawValue[newRawValue.length - 1] === "."//输入为'.' 或者 删除'.'后所有内容('xxx.')
      || (newValueString.indexOf("0.") != -1 && newValueString.substring(0, 2) === "0.") || (newValueString.indexOf("-0.") != -1) //'0.'或'-0.'
      ? newRawValue : newValue.toString().split("");

    if (newValue == 0 && (inputKey === "0" || inputKey === "00")) {//值为0 时候 输入多个0
      if (newValueString.indexOf(".") != -1) {//浮点数
        if (cursorPos < newValueString.indexOf('.'))
          newRawValue.splice(cursorPos, 1);
        newValueArr = newRawValue;
      } else {//整数
        newValueArr = (newValueString.indexOf("-") != -1) ? ["-", "0"] : ['0'];
      }
    }

    return newValueArr.join('')
  }

  private createKeyboard(el, events?: Events, options?: KeyboardOptions): ComponentRef<NumericKeyboardComponent> {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(NumericKeyboardComponent)
      .create(this.injector);

    if (options) {
      Object.assign(componentRef.instance, options);
    }

    componentRef.instance.ngOnInit();

    for (const event in events || {}) {
      componentRef.instance[event].subscribe(events[event].bind(this));
    }

    this.appRef.attachView(componentRef.hostView);
    const element = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    el.appendChild(element);

    return componentRef;
  }

  openKeyboard(options?: KeyboardOptions & { events?: Events }) {
    if (this.keyboard) {
      return;
    }

    const elContainer = document.createElement('div');
    const elShadow = document.createElement('div');
    const elKeyboard = document.createElement('div');
    elContainer.className = 'numeric-keyboard-actionsheet';
    elContainer.appendChild(elShadow);
    elContainer.appendChild(elKeyboard);
    document.body.appendChild(elContainer);

    this.keyboardElement = elKeyboard;
    const inputHandler = this.handleButtonClicked.bind(this);
    let timer$: Subscription | null = null;
    this.keyboard = this.createKeyboard(
      elKeyboard,
      Object.assign({
        press: inputHandler,
        longPress: key => {
          if (key === ENTER) {
            this.handleButtonClicked(key);
            return;
          }

          timer$ = timer(0, 100)
            .pipe(map(v => key))
            .subscribe(inputHandler);
        },
        longPressEnd(key: string) {
          if (timer$) {
            timer$.unsubscribe();
            timer$ = null;
          }
        }
      }, options?.events ?? {}),
      options
    );

    animate(
      (timestamp, frame, frames) => {
        elKeyboard.style.position = 'fixed';
        elKeyboard.style.bottom = '0';
        elKeyboard.style.left = '0';
        elKeyboard.style.transform = `translateY(${((frames - frame) / frames) * 100}%)`;
      },
      () => this.register(),
      10
    );
  }

  closeKeyboard() {
    if (!this.keyboard) {
      return;
    }

    const keyboard = this.keyboard;
    const elKeyboard = this.keyboardElement;

    animate(
      (timestamp, frame, frames) => {
        elKeyboard.style.transform = `translateY(${(frame / frames) * 100}%)`;
      },
      () => {
        setTimeout(() => {
          this.destroyKeyboard(elKeyboard, keyboard);
          document.body.removeChild(elKeyboard.parentNode);
        }, 50);
      },
      10
    );

    this.keyboard = null;
    this.keyboardElement = null;
  }


  private destroyKeyboard(el, keyboard) {
    keyboard.destroy();
    this.appRef.detachView(keyboard.hostView);
  }

  private register() {
    this.touchend$ = fromEvent(document, 'touchend').subscribe(evt => this.unregister(evt));
  }

  private unregister(e?: any) {
    if (
      e &&
      this.keyboardElement &&
      (this._activeInputElement.contains(e.target) ||
        this.keyboardElement === e.target ||
        this.keyboardElement.contains(e.target))
    ) {
      return;
    }

    if (this.touchend$) {
      this.touchend$.unsubscribe();
      this.touchend$ = null;
    }

    if (e) {
      this.closeKeyboard();
    }
  }
}

export interface Events {
  enterpress?(): void;
  press?(key: string): void;
  longEnterpress?(): void;
  longPress?(key: string): void;
  longEnterpressEnd?(): void;
  longPressEnd?(key: string): void;
  clickEnter?(key: string): void;
}

export type InputElement = HTMLInputElement | HTMLTextAreaElement | ElementRef<HTMLInputElement | HTMLTextAreaElement>;
