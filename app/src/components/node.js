class Node {
    constructor(tag, {classList='', textContent='', attributes={}}) {
        this.element = document.createElement(tag);
        this.element.className = classList;
        this.element.textContent = textContent;
        
        Object
            .entries(attributes)
            .forEach(([key, value]) =>
                this.element.setAttribute(key, value)
            );
    }

    addHandler(event, callback) {
        this.element.addEventListener(event, callback);
    }

    removeHandler(event, callback) {
        this.element.removeEventListener(event, callback);
    }

    addClass(addedClass) {
        this.element.classList.add(addedClass);
    }

    removeClass(removedClass) {
        this.element.classList.remove(removedClass);
    }

    appendTo(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.append(this.element);
    }

    insertText(text, replacement=false) {
        if (replacement) {
            this.element.innerHTML = '';
        }
        this.element.textContent = text;
    }

    setFocus(focus=true) {
        if (focus) {
            this.element.focus();
        } else {
            this.element.blur();
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}