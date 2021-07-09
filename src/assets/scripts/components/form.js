class UserForm {
    constructor() {
        this.form = createElementNode('form');
        this.form.innerHTML = `
            <input type="text" name="inputText">
            <button class="edit-ok">ОK</button>
            <button class="edit-cancel">CANCEL</button>
        `;

        this.form.onsubmit = () => {return false;};
    }

    appendTo(parent, focused=false) {
        parent.appendChild(this.form);

        if (focused) {
            this.setFocus();
        }
    }

    replaceIn(parent, focused=false) {
        Array.from(parent.childNodes).map(childe => childe.remove());
        parent.append(this.form);

        if (focused) {
            this.setFocus();
        }
    }

    setFocus() {
        this.form.inputText.focus();
    }

    getValue() {
        return this.form.inputText.value;
    }
}

class SelectionForm {
    constructor() {
        this.state = {
            value: false
        }

        this.checkbox = createElementNode('label');
        this.checkbox.innerHTML = `<input type="checkbox">`; 
    }
}