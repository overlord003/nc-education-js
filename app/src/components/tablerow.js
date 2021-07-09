class TableRow extends Node {
    constructor(name='', props={}) {
        super('div', {classList: 'table__row table-row'});
        
        this._userItem = new Node('div', {classList: 'table-row__user-item user-item', textContent: name});
        this._userItem.appendTo(this.element);
    }

    generateClick() {
        this._userItem.element.dispatchEvent(new Event('click', {bubbles: true}));
    }
}