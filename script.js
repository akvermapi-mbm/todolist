// ========================================
// TO-DO LIST APPLICATION
// Complete JavaScript File
// ========================================

// ========== DATA ==========
let tasks = [];
let currentFilter = 'all';

// ========== DOM ELEMENTS ==========
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// ========== STORAGE FUNCTIONS ==========
function generateId() {
  return Date.now();
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function updateTaskCounter() {
  const activeTasks = tasks.filter(task => !task.completed).length;
  taskCount.textContent = activeTasks;
}

// ========== RENDER FUNCTION ==========
function renderTasks() {
  let filteredTasks = [];

  if (currentFilter === 'all') {
    filteredTasks = tasks;
  } else if (currentFilter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  taskList.innerHTML = '';

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    if (task.completed) {
      taskText.classList.add('completed');
    }
    taskText.textContent = task.text;
    taskText.addEventListener('dblclick', () => editTask(task.id, taskText));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateTaskCounter();
}

// ========== CRUD OPERATIONS ==========
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const newTask = {
    id: generateId(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveToLocalStorage();
  taskInput.value = '';
  renderTasks();
}

function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveToLocalStorage();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();
  renderTasks();
}

function editTask(id, taskTextElement) {
  const oldText = taskTextElement.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = oldText;
  input.className = 'edit-input';
  input.style.width = '100%';
  input.style.padding = '5px';
  input.style.fontSize = '16px';

  taskTextElement.replaceWith(input);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();

    if (newText === '') {
      alert('Task cannot be empty!');
      taskTextElement.textContent = oldText;
      input.replaceWith(taskTextElement);
      return;
    }

    const task = tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      saveToLocalStorage();
      renderTasks();
    }
  }

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  });

  input.addEventListener('blur', saveEdit);
}

function setFilter(filter) {
  currentFilter = filter;

  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderTasks();
}

// ========== EVENT HANDLERS ==========
function handleKeyPress(e) {
  if (e.key === 'Enter') {
    addTask();
  }
}

// ========== INITIALIZATION ==========
function init() {
  loadFromLocalStorage();
  renderTasks();

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', handleKeyPress);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setFilter(filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
