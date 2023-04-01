import * as Keys from './keys'
import { animate } from './utils';
const RTel = /^\d*$/;

export const KeyboardCenter = (() => {
    let active;
    return {
        register(input: any) {
            this.unregister();
            active = input;
            document.addEventListener('touchend', this.unregister, false);
        },
        unregister(e: any) {
            if (!active) {
                return;
            }
            debugger
            if (e && (active.ks.inputElement.contains(e.target) || active.ks.keyboardElement.contains(e.target))) {
                return;
            }
            active.closeKeyboard();
            active = null;
            document.removeEventListener('touchend', this.unregister, false);
        }
    };
})();

export const Options = {
    type: 'number',
    value: '',
    name: '',
    layout: 'number',
    entertext: 'Enter',
    negative: false
};

export class Parent {
    private _negative: boolean = Options.negative;//正负"-/+"使用的
    layout: string;
    public isFocus = false;
    public kp: any;
    public ks: any;

    init(options) {
        const rawValue = [];
        this.kp = options;
        this.ks = {
            rawValue,
            keyboard: null,
            inputElement: null,
            keyboardElement: null
        };
    }
    destroy() {
        KeyboardCenter.unregister(null)
    }

    set(key, value) {
        this.ks[key] = value;
    }

    onInputElement(el: any) {
        this.set('inputElement', el);
    }

    input(key: any) {

        switch (key) {
            case Keys.BLANK:
                break;
            case Keys.ESC:
                this.closeKeyboard();
                break;
            case Keys.ENTER:
                this.closeKeyboard();
                this.dispatch("enterpress");
                break;
            case Keys.DEL:
                break;
            case Keys.DOT:
            case Keys.ZERO:
            case Keys.ONE:
            case Keys.TWO:
            case Keys.THREE:
            case Keys.FOUR:
            case Keys.FIVE:
            case Keys.SIX:
            case Keys.SEVEN:
            case Keys.EIGHT:
            case Keys.NINE:
            case Keys.NEGATIVE:
            case Keys.DOUBLEZERO:
                this.dispatch('input', key);
                break;
        }
    }
    openKeyboard() {
        if (this.ks.keyboard) {
            return;
        }
        const elContainer = document.createElement('div');
        const elShadow = document.createElement('div');
        const elKeyboard = document.createElement('div');
        elContainer.className = 'numeric-keyboard-actionsheet';
        elContainer.appendChild(elShadow);
        elContainer.appendChild(elKeyboard);
        document.body.appendChild(elContainer);

        this.createKeyboard(
            elKeyboard,
            {
                layout: this.kp.layout || this.kp.type,
                entertext: this.kp.entertext
            },
            {
                press: this.input.bind(this)
            },
            keyboard => this.set('keyboard', keyboard)
        );

        animate(
            (timestamp, frame, frames) => {
                elKeyboard.style.position = 'fixed';
                elKeyboard.style.bottom = '0';
                elKeyboard.style.left = '0';
                elKeyboard.style.transform = `translateY(${((frames - frame) / frames) * 100}%)`;
            },
            () => { },
            10
        );

        this.set('keyboardElement', elKeyboard);
        this.isFocus = true;
        this.dispatch('focus');
        KeyboardCenter.register(this);
    }

    closeKeyboard() {
        if (!this.ks.keyboard) {
            return;
        }
        const keyboard = this.ks.keyboard;
        const elKeyboard = this.ks.keyboardElement;

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

        this.set('keyboard', null);
        this.set('keyboardElement', null);
        this.isFocus = false;
        this.dispatch('blur');
        KeyboardCenter.unregister(null);
    }

    createKeyboard(el, options, events, callback) {
        throw new Error('createKeyboard method must be overrided!')
    }

    destroyKeyboard(el, keyboard) {
        throw new Error('destroyKeyboard method must be overrided!')
    }
    dispatch(event: string, payload?: number | string) {
        throw new Error('dispatch method must be overrided!')
    }
}