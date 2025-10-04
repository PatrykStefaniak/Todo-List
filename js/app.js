function initListeners() {
    const button = document.getElementById('add-button');

    button.addEventListener('click', this.onAddTodoItemClick);
}

function onAddTodoItemClick() {
    
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        initListeners();
    }
 }