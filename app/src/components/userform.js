class Input extends Node {
    constructor(type) {
        super('input', {
            attributes: {
                type: type,
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
        super('form', props);

        this._inputText = new Input('text');
        this._inputText.appendTo(this.element);
        
        this._btnOk = new Button('edit-ok', 'OK');
        this._btnOk.appendTo(this.element);

        this._btnCancel = new Button('edit-cancel', 'CANCEL');
        this._btnCancel.appendTo(this.element);
    }

    appendTo(parent, replacement=false, focused=false) {
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