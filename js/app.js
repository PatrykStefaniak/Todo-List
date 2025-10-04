document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        initListeners();
    }
}

function initListeners() {
    const button = document.getElementById('add-button');

    button.addEventListener('click', this.onAddTodoItemClick);
}

function onAddTodoItemClick() {
    const input = document.getElementById('task-input');
    const text = input.value;

    if (text === '') {
        return showError('Task name cannot be empty');
    }

    const tr = document.createElement('tr');
    tr.append(createTextTd(text), createEditTd(), createDeleteTd());

    const table = document.querySelector('#table-container table');

    table.append(tr);
    input.value = '';
}

function createTextTd(text) {
    const el = document.createElement('td');
    el.classList.add('text-td');
    el.textContent = text;
    return el;
}

function createEditTd() {
    return createActionTd(false);
}

function createDeleteTd() {
    return createActionTd(true);
}

function createActionTd(isDelete) {
    const el = document.createElement('td');
    const button = document.createElement('button');
    const div = document.createElement('div');

    button.append(div);
    el.append(button);

    div.classList.add('icon', isDelete ? 'icon-trash-can' : 'icon-pen')

    const handler = () => {
        if (isDelete) {
            button.removeEventListener('click', handler);
            onDelete(el);
        } else {
            onEdit(el);
        }
    };

    button.addEventListener('click', handler);

    return el;
}

function onDelete(td) {
    td.parentElement.remove();
}

function onEdit(td) {
    const tr = td.parentElement;
    const textTd = tr.firstChild;
    const editTd = tr.childNodes[1];
    const input = document.createElement('input');
    const confirmButton = document.createElement('button');
    const confirmIcon = document.createElement('div');
    const buttonHandler = () => {
        const value = input.value;

        if (value == '') {
            return showError('Task name cannot be empty');
        }

        textTd.textContent = input.value;

        confirmButton.removeEventListener('click', buttonHandler);

        confirmButton.remove();
        input.remove();
        editTd.classList.remove('hidden');
    };

    input.classList.add('edit-input');
    input.value = textTd.textContent;

    confirmIcon.classList.add('icon', 'icon-check');
    confirmButton.append(confirmIcon);

    editTd.classList.add('hidden');

    textTd.textContent = '';
    textTd.append(input, confirmButton);

    input.focus();

    confirmButton.addEventListener('click', buttonHandler);
}

function showError(message) {
    const container = document.querySelector('#info-container div');

    container.textContent = message;
    container.classList.remove('hidden');
    container.classList.add('error');

    container.addEventListener('animationend', () => {
        container.classList.remove('error');
        container.textContent = '';
    });
}