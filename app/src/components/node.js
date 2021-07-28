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

    addHandler(event, callback, capture=false) {
        this.element.addEventListener(event, callback, capture);
    }

    removeHandler(event, callback, capture=false) {
        this.element.removeEventListener(event, callback, capture);
    }

    dispatchEvent(event) {
        return this.element.dispatchEvent(event);
    }

    addClass(addedClass) {
        this.element.classList.add(addedClass);
    }

    removeClass(removedClass) {
        this.element.classList.remove(removedClass);
    }

    appendIn(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.element.append(this.element);
    }

    appendTo(parent, replacement=false) {
        if (replacement) {
            parent.innerHTML = '';
        }
        parent.append(this.element);
    }

    insertAsHtml(html) {
        this.element.insertAdjacentHTML("afterbegin", html);
    }

    removeChildren() {
        this.element.innerHTML = '';
    }

    insertText(text, replacement=false) {
        if (replacement) {
            this.element.innerHTML = '';
        }
        this.element.textContent = text;
    }

    insertHTML(html) {
        this.element.innerHTML = html;
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

    makeDragNDrop() {
        this.element.draggable = true;
    }
}