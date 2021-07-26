class Table extends Node {
    constructor(parentClass, names=[], dates) {
        if (typeof Table.instance === 'object') {
            return Table.instance;
        }

        super('div', {classList: `${parentClass}__table table`});

        this.dates = dates;

        // Создаем заголовок
        this.header = new Node('div', {
            classList: 'table__header table-header'
        });
        let item = new Node('div', {
            classList:  'table-header__item',
            textContent: 'Участники'
        });
        item.appendIn(this.header);
        dates.forEach(date => {
            let item = new Node('div', {
                classList:  'table-header__item',
                textContent: date 
            });
            item.appendIn(this.header);
        });
        this.header.appendIn(this);
        /* Созданиие заголовка закончено */

        // Создаем строчки c именами из localStorage
        this.rows = [];
        names.forEach(name => {
            let row = new TableRow(name, dates.length);
            row.appendTo(this.element);
            this.rows.push(row);

            // store.dispatch({
            //     type: 'ADD_NAME',
            //     payload: name    
            //  });
        });

        this._editingItem = null;     
        this.element.onclick = (event) => {
            let target = event.target.closest('.user-item, .edit-cancel');
            if (!this.element.contains(target)) return;
        
            if (target.classList.contains('edit-cancel')) {
                this._finishUserItemEdit();
            } else if (target.classList.contains('user-item')) { 
                if (this._editingItem) {
                    return;
                }
                this._makeItemEditable(target);
            }
        };

        // Drag n drop start
        const getNextElement = (cursorPosition, currentElement) => {
            const currentElementCoord = currentElement.getBoundingClientRect();
            const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
          
            const nextElement = (cursorPosition < currentElementCenter) ?
                currentElement :
                currentElement.nextElementSibling;
          
            return nextElement;
        };

        this.addHandler('dragstart', (event) => 
            event.target.classList.add('_selected')
        );

        this.addHandler('dragend', (event) => {
            event.target.classList.remove('_selected');
            if (event.target.classList.contains('_deleted')) {
                let userItem = event.target.querySelector('.user-item');
                store.dispatch({
                    type: 'REMOVE_NAME',
                    payload: userItem.innerHTML
                });
                event.target.remove();
            }
        });

        this.addHandler('dragover', (event) => {
            event.preventDefault();

            let activeElement = this.element.querySelector('._selected');
            activeElement.classList.remove('_deleted');
        
            let currentElement = event.target.closest('.table-row');
            
            let deletedZone = event.target.closest('.deleted-zone');
            
            if (currentElement) {
                if (activeElement === currentElement) return;

                const nextElement = getNextElement(event.clientY, currentElement);
                this.element.insertBefore(activeElement, nextElement);
            } else if (deletedZone) {
                activeElement.classList.add('_deleted');
            } 
        });

        // Зона для удаления элементов
        this.deletedZone = new Node('div', {
            classList: 'table__deleted-zone deleted-zone'
        });
        this.deletedZone.appendIn(this);

        // Drag n drop end

        Table.instance = this;
        return this;
    }

    _makeItemEditable(item) {
        this._editingItem = {
            item: item,
            data: item.innerHTML,
            form: new UserForm({
                classList: 'form'
            })
        };
    
        item.classList.add('edit-item');
        this._editingItem.form.appendTo(item, true);
        this._editingItem.form.name = this._editingItem.data;

        // Работа с формой
        this._editingItem.form.addHandler('submit', (event) => {
            event.preventDefault();
            
            const newValue = this._editingItem.form.name;
            if (!newValue) return;
            if (store.checkStoreNames(newValue)) {
                alert('Такое имя уже есть!');
                return;
            }

            this._editingItem.item.innerHTML = newValue;

            let lastValue = this._editingItem.data;
            store.dispatch({
                type: 'RENAME_NAME',
                payload: {lastValue, newValue}  
            });

            this._editingItem.item.classList.remove('edit-item');
            this._editingItem = null;
        });
    }
    
    _finishUserItemEdit() {
        if (!this._editingItem.data) return;
        this._editingItem.item.innerHTML = this._editingItem.data;   
        this._editingItem.item.classList.remove('edit-item');
        this._editingItem = null;
    }

    addNewRow() {
        if (this._editingItem) {
            alert('Вы не закончили редактировать текущего пользователя.');
            return;
        }

        let newRow = new TableRow('', this.dates.length);
        newRow.appendTo(this.element);
        newRow.generateClick();
        this.rows.push(newRow);

        store.dispatch({
           type: 'ADD_NAME',
           payload: ''    
        });
    }

    // Очень сложная логика да
    update(dates) {
        // Если дата была удалена
        if (dates.length < this.dates.length) {
            const index = this.dates.findIndex(
                item => !dates.includes(item)
            );
            this.rows.forEach(row => row.deleteByIndex(index));
            // Ту-ту!!!!
            let element = this.header.element.firstElementChild.nextElementSibling;
            let i  = 0;
            while (i < index) {
                element = element.nextElementSibling;
                i += 1;
            }
            element.remove();
        // Если дата была добавлена
        } else if (dates.length > this.dates.length) {
            const element = dates.find(
                item => !this.dates.includes(item)
            );
            console.log(element);
            this.rows.forEach(row => row.appendNewItem());
            let item = new Node('div', {
                classList:  'table-header__item',
                textContent: element
            });
            item.appendIn(this.header);
        }
        this.dates = dates.slice(0);
    }
}