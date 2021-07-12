class SelectionForm extends Node {
    constructor(value=false, props={}) {
        super('label', props);

        this._checkbox = new Node('input', {classList: 'checkbox__input _hidden', attributes: {type: 'checkbox'}});
        this._checkbox.appendTo(this.element);

        this._checkboxContent = new Node('span', {classList: 'checkbox__content'});
        this._checkboxContent.appendTo(this.element);
    }
}