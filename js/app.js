import {Storage} from './storage.js';

const storage = new Storage('todoList');

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        initListeners();
    }

    const storageItems = storage.getAll();

    if (!storageItems.length) {
        return;
    }

    const table = document.querySelector('#table-container table');

    storageItems.forEach((item) => {
        const parsed = JSON.parse(item);
        table.append(createTr(parsed.text, parsed.id));
    });
}

function initListeners() {
    const button = document.getElementById('add-button');

    button.addEventListener('click', onAddTodoItemClick);

    document.getElementById('table-container').addEventListener('click', (e) => {
        const tr = e.target.closest('tr');

        if (!tr) {
            return;
        }

        toggleCheckbox(tr);
    });
}

function toggleCheckbox(tr) {
    const input = tr.querySelector('.checkbox-td input');
    const checked = input.checked = !input.checked;

    getTextTd(tr).classList[checked ? 'add' : 'remove']('completed-task');
}

function onAddTodoItemClick() {
    const input = document.getElementById('task-input');
    const text = input.value;
    const table = document.querySelector('#table-container table');

    if (text === '') {
        return showError('Task name cannot be empty');
    }

    const tr = createTr(text);

    table.append(tr);
    input.value = '';

    storage.setObject(tr.id, {
        id: tr.id,
        completed: false,
        text: text
    });
}

function createTr(text, id) {
    const tr = document.createElement('tr');
    const checkboxTd = createCheckboxTd();

    tr.append(checkboxTd, createTextTd(text), createEditTd(), createDeleteTd());
    tr.id = id || crypto.randomUUID();

    return tr;
}

function createCheckboxTd() {
    const el = document.createElement('td');
    const checkbox = document.createElement('input');

    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('hidden');

    el.classList.add('checkbox-td');

    el.append(checkbox);

    return el;
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

    if (isDelete) {
        div.classList.add('icon', 'icon-trash-can');
        el.classList.add('delete-td');
    } else {
        div.classList.add('icon', 'icon-pen');
        el.classList.add('edit-td');
    }

    const handler = () => {
        if (isDelete) {
            button.removeEventListener('click', handler);
            storage.remove(el.parentElement.id);
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
    const textTd = getTextTd(tr);
    const editTd = getEditTd(tr);
    const input = document.createElement('input');
    const confirmButton = document.createElement('button');
    const confirmIcon = document.createElement('div');
    const buttonHandler = () => {
        const value = input.value;

        if (value == '') {
            return showError('Task name cannot be empty');
        }

        const storageTask = storage.getObject(tr.id);

        storageTask.text = input.value;

        storage.setObject(tr.id, storageTask);

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

function getTextTd(tr) {
    return tr.querySelector('.text-td');
}

function getEditTd(tr) {
    return tr.querySelector('.edit-td');
}