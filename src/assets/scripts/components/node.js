// Для создания узлов-элементов
function createElementNode(tag, className='', attributes=null, handlers=null) {
    let element = document.createElement(tag);
    element.className = className;
    for (key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    for (key in handlers) {
        element.addEventListener(key, handlers[key]);
    }
    return element;
}

// Для вставки node в targetNode
function render(node, targetNode) {
    targetNode.append(node);
}