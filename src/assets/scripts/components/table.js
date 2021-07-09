class TableRow {
    constructor(name='') {
        this.row = createElementNode('div', 'table__row table-row');
        this.row.innerHTML = `<div class="table-row__user-item user-item">${name}</div>`;
    }

    appendTo(parent) {
        parent.appendChild(this.row);
    }

    generateClick() {
        this.row.querySelector('.user-item').dispatchEvent(new Event('click', {bubbles: true}));
    }
}

class Table {
    constructor() {
        if (typeof Table.instance === 'object') {
            return Table.instance;
        }

        this._editingItem = null;

        this.table = createElementNode('div', 'table');
        this.table.onclick = (event) => {
            let target = event.target.closest('.user-item, .edit-ok, .edit-cancel');
            if (!this.table.contains(target)) return;
        
            if (target.classList.contains('edit-ok')) {
                this._finishUserItemEdit(true);
            } else if (target.classList.contains('edit-cancel')) {
                this._finishUserItemEdit();
            } else if (target.classList.contains('user-item')) { 
                if (this._editingItem) {
                    return;
                }
                this._makeItemEditable(target);
            }
        };

        Table.instance = this;
        return this;
    }

    _makeItemEditable(item) {
        this._editingItem = {
            item: item,
            data: item.innerHTML,
            form: new UserForm()
        };
    
        item.classList.add('edit-item');
        this._editingItem.form.replaceIn(item, true);
    }
    
    _finishUserItemEdit(isOk=false) {
        if (isOk) {
            let newValue = this._editingItem.form.getValue();
            if (newValue) {
                this._editingItem.item.innerHTML = newValue;

                let lastValue = this._editingItem.data;
                store.dispatch({
                    type: 'RENAME',
                    payload: {lastValue, newValue}  
                });
            } else {
                alert('И что за фигня? Введи сюда хоть что-то, паразит.');
                return;
            }
        } else { 
            this._editingItem.item.innerHTML = this._editingItem.data;
        }
    
        this._editingItem.item.classList.remove('edit-item');
        this._editingItem = null;
    }

    addNewRow() {
        if (this._editingItem) {
            alert('Попытался сломать? Фиг тебе! Сначала закончи с предыдущим пользователем.');
            return;
        }

        let newRow = new TableRow();
        newRow.appendTo(this.table);
        newRow.generateClick();

        store.dispatch({
           type: 'ADD',
           payload: ''    
        });
    }

    // Чисто для генерации начальных строчек, чтобы было не так пусто...
    generateRow(name) {
        let newRow = new TableRow(name);
        newRow.appendTo(this.table);

        store.dispatch({
            type: 'ADD',
            payload: name    
        });
    }

    appendTo(parent) {
        parent.appendChild(this.table);
    }
}