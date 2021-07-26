class TableRow extends Node {
    constructor(name, columns, props={}) {
        super('div', {classList: 'table__row table-row'});
        
        this._userItem = new Node('div', {
            classList: 'table-row__user-item item user-item',
            textContent: name
        });
        this._userItem.appendTo(this.element);

        this._checkboxItems = new Array(columns).fill(null);
        this._checkboxItems
            .forEach(item => {
                item = new SelectionForm(false, {classList: 'item checkbox-item'});
                item.appendTo(this.element);
            }
        );

        // Drag n drop
        this.makeDragNDrop();
    }


    // Добавить потом проверку на то что индекс больше чем кол-во элементов
    deleteByIndex(index) {
        let element = this.element.firstElementChild.nextElementSibling;

        let i  = 0;
        while (i < index) {
            element = element.nextElementSibling;
            i += 1;
        }

        element.remove();
    }

    appendNewItem() {
        let item = new SelectionForm(false, {classList: 'item checkbox-item'});
        item.appendIn(this);
    }

    generateClick() {
        this._userItem.element.dispatchEvent(new Event('click', {bubbles: true}));
    }

    getBooleanArray() {
        let array = Array
            .from(this.element.querySelectorAll('.checkbox__input'))
            .map(item => {
                return item.checked;
            });
        console.log(array);
        return array;
    }
}