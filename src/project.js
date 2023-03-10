export default function Project(id, title) {
    let todos = [];

    function addToDo(todo) {
        this.todos.push(todo);
        this.todos.sort(function(a, b) { 
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }

    function removeToDo(index) {
        if(index < todos.length) {
            todos.splice(index, 1);
        } else {
            alert("Attempting to remove an invalid to-do");
        }
    }

    return {
        id: id,
        title: title,
        todos: todos,
        addToDo,
        removeToDo
    }
}
