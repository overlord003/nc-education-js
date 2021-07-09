class UserForm extends Node {
    constructor(props={}) {
        super('form', props);
        this.element.onsubmit = () => {return false;};

        this._inputText = new Node('input', {attributes: {type: 'text', name: 'inputText'}});
        this._inputText.appendTo(this.element);
        
        this._btnOk = new Button({classList: 'edit-ok', textContent: 'OK'});
        this._btnOk.appendTo(this.element);

        this._btnCancel = new Button({classList: 'edit-cancel', textContent: 'CANCEL'});
        this._btnCancel.appendTo(this.element);
    }

    appendTo(parent, focused=false) {
        super.appendTo(parent);

        if (focused) {
            this._setFocus();
        }
    }

    replaceIn(parent, focused=false) {
        super.replaceIn(parent);

        if (focused) {
            this._setFocus();
        }
    }

    _setFocus() {
        this._inputText.element.focus();
    }

    getValue() {
        return this._inputText.element.value;
    }
}