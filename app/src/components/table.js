class Table extends Node {
    constructor(names=[], columns=0) {
        if (typeof Table.instance === 'object') {
            return Table.instance;
        }

        // super('div', {classList: 'table-section__table table'});
        super('div', {classList: ''});


        this.rows = [];
        names.forEach(name => {
            let row = new TableRow(name, columns);
            row.appendTo(this.element);
            this.rows.push(row);

            store.dispatch({
                type: 'ADD',
                payload: name    
             });
        });

        this._editingItem = null;     
        this.element.onclick = (event) => {
            let target = event.target.closest('.user-item, .edit-ok, .edit-cancel');
            if (!this.element.contains(target)) return;
        
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
        this._editingItem.form.appendTo(item, true);
    }
    
    _finishUserItemEdit(isOk=false) {
        if (isOk) {
            let newValue = this._editingItem.form.name;
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

    addNewRow(columns) {
        if (this._editingItem) {
            alert('Попытался сломать? Фиг тебе! Сначала закончи с предыдущим пользователем.');
            return;
        }

        let newRow = new TableRow('', columns);
        newRow.appendTo(this.element);
        newRow.generateClick();
        this.rows.push(newRow);

        store.dispatch({
           type: 'ADD',
           payload: ''    
        });
    }
}