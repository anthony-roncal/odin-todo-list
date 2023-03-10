import './style.css';
import Todo from './todo';
import Project from './project';
import viewController from './viewController';

// init projects and currentProject in localStorage
if(!JSON.parse(localStorage.getItem('projects'))) {
    localStorage.setItem('projects', JSON.stringify(''));
}
if(!JSON.parse(localStorage.getItem('currentProject'))) {
    localStorage.setItem('currentProject', JSON.stringify('0'));
}
let projects = (Array.from(JSON.parse(localStorage.getItem('projects'))));
let currentProject = Number.parseInt(JSON.parse(localStorage.getItem('currentProject')));

if(projects.length === 0) {
    const defaultProject = Project(0, "To-Do");
    projects.push(defaultProject);
    populateStorage();
}

// init viewController
const view = viewController(projects, currentProject);

// add event listeners
addProjectEventListeners();
addTodoEventListeners();

document.querySelector('.show-add-project-form-btn').addEventListener('click', toggleAddProjectForm);
document.querySelector('.add-project-cancel-btn').addEventListener('click', toggleAddProjectForm);

document.querySelector('.add-project-btn').addEventListener('click', addProject);
document.querySelector('.add-project-field').addEventListener('keydown', e => {
    if (e.code === 'Enter') {
        addProject();
    }
});

document.querySelector('.show-add-todo-form-btn').addEventListener('click', toggleAddTodoForm);
document.querySelector('.add-todo-cancel-btn').addEventListener('click', toggleAddTodoForm);

document.querySelector('.add-todo-btn').addEventListener('click', addTodo);
document.querySelector('.add-todo-field').addEventListener('keydown', e => {
    if (e.code === 'Enter') {
        addTodo();
    }
});

function addProjectEventListeners() {
    document.querySelectorAll('.project-item').forEach(item => item.addEventListener('click', selectProject));
    document.querySelectorAll('.delete-project').forEach(btn => btn.addEventListener('click', deleteItem));
}

function selectProject(e) {
    console.log('selectProject');
    currentProject = Array.from(e.target.parentNode.children).indexOf(e.target);
    view.updateCurrentProject(currentProject);
    view.updateTodos(projects[currentProject]);
    addTodoEventListeners();
    populateStorage();
}

function addTodoEventListeners() {
    document.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.addEventListener('click', completeTodo));
    document.querySelectorAll('.todo-item').forEach(todoItem => todoItem.addEventListener('click', toggleShowTodoDetails));
    document.querySelectorAll('.edit-details-btn').forEach(editBtn => editBtn.addEventListener('click', toggleTodoEditMode));
    document.querySelectorAll('.save-details-btn').forEach(saveBtn => saveBtn.addEventListener('click', saveTodoEdit));
    document.querySelectorAll('.cancel-details-btn').forEach(cancelBtn => cancelBtn.addEventListener('click', toggleTodoEditMode));
    document.querySelectorAll('.delete-todo').forEach(btn => btn.addEventListener('click', deleteItem));
}

function addProject() {
    console.log('addProject');
    const addProjectFieldValue = document.querySelector('.add-project-field').value.toString().trim();
    if(addProjectFieldValue) {
        const newProject = Project(projects.length, addProjectFieldValue);
        projects.push(newProject);
        view.toggleAddProjectForm();
        view.updateProjects(currentProject);
        addProjectEventListeners();
        populateStorage();
    }
} 

function addTodo() {
    console.log('addTodo');
    const addTodoFieldValue = document.querySelector('.add-todo-field').value.toString().trim();
    if(addTodoFieldValue) {
        const newTodo = Todo(addTodoFieldValue);
        projects[currentProject].todos.push(newTodo);
        view.toggleAddTodoForm();
        view.updateTodos(projects[currentProject]);
        addTodoEventListeners();
        populateStorage();
    }
}

function toggleAddProjectForm() {
    console.log('toggleAddProjectForm');
    view.toggleAddProjectForm();
}

function toggleAddTodoForm() {
    console.log('toggleAddTodoForm');
    view.toggleAddTodoForm();
}

function completeTodo(e) {
    console.log('completeTodo');
    let index = Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode);
    projects[currentProject].todos[index].complete = !projects[currentProject].todos[index].complete;
    populateStorage();
}

function toggleShowTodoDetails(e) {
    console.log('toggleShowTodoDetails');
    view.toggleShowTodoDetails(e);
}

function toggleTodoEditMode(e) {
    console.log('toggleTodoEditMode');
    view.toggleTodoEditMode(e);
}

function saveTodoEdit(e) {
    e.preventDefault();
    let index = Array.from(e.target.parentNode.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode.parentNode);
    // console.log(projects[currentProject].todos[index]);

    var formData = new FormData(Array.from(document.querySelectorAll('.todo-ul form'))[index]);
    for (var pair of formData.entries()) {
        projects[currentProject].todos[index][pair[0]] = pair[1];
    }
    console.log(projects[currentProject].todos[index]);
    view.updateTodos(projects[currentProject]);
    addTodoEventListeners();
    populateStorage();
}

function deleteItem(e) {
    console.log('deleteItem');
    let index = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);
    (e.target.classList[0] === "delete-project") ? projects.splice(index, 1) : projects[currentProject].removeToDo(index);
    view.removeItem(e);
    populateStorage();
}

function populateStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('currentProject', JSON.stringify(currentProject));
}