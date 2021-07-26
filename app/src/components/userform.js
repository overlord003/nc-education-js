class Input extends Node {
    constructor(parentClass, type) {
        super('input', {
            classList: parentClass,
            attributes: {
                type: type,
                maxlength: 32
            }
        });
    }

    get value() {
        return this.element.value;
    }

    set value(text) {
        this.element.value = text;
    }
}

class UserForm extends Node {
    constructor(props={}) {
        super('form', {
            classList: 'edit-item__form form'
        });

        this._inputText = new Input('form__input input', 'text');
        this._inputText.appendTo(this.element);
        // this._inputText.addHandler('input', (event) => {
        //     if (this._inputText.value.length > 13) {
        //         alert('Превышено допустимое количество символов!');
        //         return false;
        //     }
        // });

        this._btnOk = new Button('form__button button edit-ok', '');
        this._btnOk.element.hidden = true;
        this._btnOk.appendTo(this.element);
        
        this._btnCancel = new Button('form__button button edit-cancel', 'x');
        this._btnCancel.appendTo(this.element);
    }

    appendTo(parent, replacement=false, focused=true) {
        super.appendTo(parent, replacement);
        this._inputText.setFocus(focused);
    }

    get name() {
        return this._inputText.value;
    }

    set name(name) {
        this._inputText.value = name;
    }
}