const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDatetime = document.getElementById('todo-datetime');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

flatpickr(todoDatetime, {
  enableTime: true,
  dateFormat: "d/m/Y h:i K",
  time_24hr: false
});

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskText = todoInput.value.trim();
  const taskDatetime = todoDatetime.value.trim();

  if (!taskText || !taskDatetime) {
    alert('Por favor, insira uma tarefa válida e selecione data e horário.');
    return;
  }

  const listItem = createTaskItem(taskText, taskDatetime, false);
  listItem.classList.add('fade-in');
  todoList.appendChild(listItem);

  todoInput.value = '';
  todoDatetime.value = '';
});

function createTaskItem(taskText, taskDatetime, isCompleted) {
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  listItem.innerHTML = `
    <div class="todo-item-content">
      <input type="checkbox" class="task-check" onclick="${isCompleted ? 'incompleteTask(this)' : 'completeTask(this)'}" />
      <span class="task-text">${taskText}</span>
      <span class="task-time-box">${taskDatetime}</span>
    </div>
    <div>
      <button class="edit" onclick="editTask(this)">Editar</button>
      <button class="delete" onclick="deleteTask(this)">Excluir</button>
    </div>
  `;
  return listItem;
}

function completeTask(checkbox) {
  const taskItem = checkbox.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => {
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskDatetime = taskItem.querySelector('.task-time-box').textContent;
    completedList.appendChild(createTaskItem(taskText, taskDatetime, true));
    taskItem.remove();
  }, 300);
}

function deleteTask(button) {
  const taskItem = button.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => taskItem.remove(), 300);
}

function editTask(button) {
  const taskItem = button.parentElement.parentElement;
  const taskTextElement = taskItem.querySelector('.task-text');
  const taskTimeElement = taskItem.querySelector('.task-time-box');
  const currentText = taskTextElement.textContent;
  const currentTime = taskTimeElement.textContent;

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.value = currentText;
  textInput.className = 'edit-input';

  const timeInput = document.createElement('input');
  timeInput.type = 'text';
  timeInput.value = currentTime;
  timeInput.className = 'datetime-input';
  flatpickr(timeInput, {
    enableTime: true,
    dateFormat: "d/m/Y h:i K",
    time_24hr: false
  });

  taskTextElement.replaceWith(textInput);
  taskTimeElement.replaceWith(timeInput);

  const saveButton = document.createElement('button');
  saveButton.className = 'edit save';
  saveButton.textContent = 'Salvar';
  saveButton.onclick = function () {
    const newText = textInput.value.trim();
    const newTime = timeInput.value.trim();

    if (!newText || !newTime) {
      alert('Por favor, preencha a tarefa e o horário corretamente.');
      return;
    }

    taskTextElement.textContent = newText;
    taskTimeElement.textContent = newTime;

    textInput.replaceWith(taskTextElement);
    timeInput.replaceWith(taskTimeElement);
    saveButton.replaceWith(button);
  };

  button.replaceWith(saveButton);
}

function incompleteTask(checkbox) {
  const taskItem = checkbox.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => {
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskDatetime = taskItem.querySelector('.task-time-box').textContent;
    todoList.appendChild(createTaskItem(taskText, taskDatetime, false));
    taskItem.remove();
  }, 300);
}
