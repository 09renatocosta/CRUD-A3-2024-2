const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDatetime = document.getElementById('todo-datetime');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');

// Inicializar Flatpickr no campo de data e horário
flatpickr(todoDatetime, {
  enableTime: true,
  dateFormat: "d/m/Y h:i K",
  time_24hr: false,
});


document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
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

  saveTasks();

  todoInput.value = '';
  todoDatetime.value = '';
});


function createTaskItem(taskText, taskDatetime, isCompleted) {
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';

  listItem.innerHTML = `
    <div class="todo-item-content">
      <input type="checkbox" class="task-check" ${isCompleted ? "checked" : ""} 
        onclick="${isCompleted ? 'incompleteTask(this)' : 'completeTask(this)'}" />
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

function saveTasks() {
  const tasks = {
    active: Array.from(todoList.children).map(item => ({
      text: item.querySelector('.task-text').textContent,
      datetime: item.querySelector('.task-time-box').textContent
    })),
    completed: Array.from(completedList.children).map(item => ({
      text: item.querySelector('.task-text').textContent,
      datetime: item.querySelector('.task-time-box').textContent
    }))
  };

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    savedTasks.active.forEach(task => {
      todoList.appendChild(createTaskItem(task.text, task.datetime, false));
    });
    savedTasks.completed.forEach(task => {
      completedList.appendChild(createTaskItem(task.text, task.datetime, true));
    });
  }
}

function completeTask(checkbox) {
  const taskItem = checkbox.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => {
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskDatetime = taskItem.querySelector('.task-time-box').textContent;
    completedList.appendChild(createTaskItem(taskText, taskDatetime, true));
    taskItem.remove();
    saveTasks();
  }, 300);
}

function incompleteTask(checkbox) {
  const taskItem = checkbox.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => {
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskDatetime = taskItem.querySelector('.task-time-box').textContent;
    todoList.appendChild(createTaskItem(taskText, taskDatetime, false));
    taskItem.remove();
    saveTasks();
  }, 300);
}

function deleteTask(button) {
  const taskItem = button.parentElement.parentElement;
  taskItem.classList.add('fade-out');
  setTimeout(() => {
    taskItem.remove();
    saveTasks();
  }, 300);
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
    time_24hr: false,
    minDate: "today" 
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

    const newDateTime = new Date(newTime);
    if (newDateTime < new Date()) {
      alert('A data e hora selecionadas já passaram. Escolha um momento no futuro.');
      return;
    }

    taskTextElement.textContent = newText;
    taskTimeElement.textContent = newTime;

    textInput.replaceWith(taskTextElement);
    timeInput.replaceWith(taskTimeElement);
    saveButton.replaceWith(button);

    saveTasks();
  };

  button.replaceWith(saveButton);
}
