// Estado de la aplicación
let tasks = [];
let currentFilter = 'all';

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');

// Contadores
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            setFilter(filter);
        });
    });
}

// Manejar agregar tarea
async function handleAddTask(e) {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    if (!text) {
        showNotification('Por favor, escribe una tarea', 'warning');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'create', task: newTask })
        });

        const result = await response.json();
        
        if (result.success) {
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
            updateStats();
            showNotification('Tarea agregada exitosamente', 'success');
        } else {
            showNotification('Error al agregar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Cargar tareas desde el servidor
async function loadTasks() {
    try {
        const response = await fetch('api.php?action=read');
        const result = await response.json();
        
        if (result.success) {
            tasks = result.tasks || [];
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        showNotification('Error al cargar las tareas', 'error');
    }
}

// Renderizar tareas
function renderTasks() {
    tasksList.innerHTML = '';
    
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    }
    
    emptyState.classList.remove('show');
    
    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        tasksList.appendChild(taskItem);
    });
}

// Crear elemento de tarea
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    checkbox.addEventListener('click', () => toggleTask(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-action btn-edit';
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Editar';
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-action btn-delete';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Eliminar';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    return li;
}

// Alternar estado de tarea
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                action: 'update', 
                id: id,
                task: task 
            })
        });

        const result = await response.json();
        
        if (result.success) {
            renderTasks();
            updateStats();
            showNotification(
                task.completed ? 'Tarea completada ✓' : 'Tarea marcada como pendiente',
                'success'
            );
        } else {
            task.completed = !task.completed; // Revertir cambio
            showNotification('Error al actualizar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        task.completed = !task.completed; // Revertir cambio
        showNotification('Error de conexión', 'error');
    }
}

// Editar tarea
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    const textSpan = taskItem.querySelector('.task-text');
    const currentText = textSpan.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = currentText;
    
    taskItem.classList.add('editing');
    textSpan.style.display = 'none';
    textSpan.parentNode.insertBefore(input, textSpan);
    input.focus();
    input.select();

    const saveEdit = async () => {
        const newText = input.value.trim();
        if (!newText) {
            cancelEdit(taskItem, textSpan, input);
            return;
        }

        if (newText === currentText) {
            cancelEdit(taskItem, textSpan, input);
            return;
        }

        task.text = newText;

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    action: 'update', 
                    id: id,
                    task: task 
                })
            });

            const result = await response.json();
            
            if (result.success) {
                textSpan.textContent = newText;
                cancelEdit(taskItem, textSpan, input);
                showNotification('Tarea actualizada', 'success');
            } else {
                task.text = currentText; // Revertir cambio
                cancelEdit(taskItem, textSpan, input);
                showNotification('Error al actualizar la tarea', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            task.text = currentText; // Revertir cambio
            cancelEdit(taskItem, textSpan, input);
            showNotification('Error de conexión', 'error');
        }
    };

    const cancelEdit = (item, span, inp) => {
        item.classList.remove('editing');
        span.style.display = '';
        inp.remove();
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit(taskItem, textSpan, input);
        }
    });
}

// Eliminar tarea
async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete', id: id })
        });

        const result = await response.json();
        
        if (result.success) {
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
            updateStats();
            showNotification('Tarea eliminada', 'success');
        } else {
            showNotification('Error al eliminar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error de conexión', 'error');
    }
}

// Filtrar tareas
function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'pending':
            return tasks.filter(t => !t.completed);
        default:
            return tasks;
    }
}

// Establecer filtro
function setFilter(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTasks();
}

// Actualizar estadísticas
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;

    // Animación de números
    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
}

// Animar números
function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    if (current === target) return;

    const increment = target > current ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(target - current);
    const stepDuration = duration / steps;

    let currentValue = current;
    const timer = setInterval(() => {
        currentValue += increment;
        element.textContent = currentValue;
        
        if (currentValue === target) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '300px'
    });

    // Colores según tipo
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    
    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

