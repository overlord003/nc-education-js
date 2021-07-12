class TableRow extends Node {
    constructor(name, columns, props={}) {
        super('div', {classList: 'table__row table-row'});
        
        this._userItem = new Node('div', {classList: 'table-row__user-item item user-item', textContent: name});
        this._userItem.appendTo(this.element);

        this._checkboxItems = new Array(columns).fill(null);
        this._checkboxItems
            .forEach(item => {
                item = new SelectionForm(false, {classList: 'item checkbox-item'});
                item.appendTo(this.element);
            }
        );
    }

    generateClick() {
        this._userItem.element.dispatchEvent(new Event('click', {bubbles: true}));
    }
}