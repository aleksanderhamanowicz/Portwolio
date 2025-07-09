
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.activeTab = 'active';
        this.editingTodo = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDate();
        this.render();
    }
    
    initializeElements() {
        // Form elements
        this.todoForm = document.getElementById('todoForm');
        this.titleInput = document.getElementById('titleInput');
        this.descriptionInput = document.getElementById('descriptionInput');
        this.deadlineInput = document.getElementById('deadlineInput');
        this.addButton = document.getElementById('addButton');
        this.expandedForm = document.getElementById('expandedForm');
        this.cancelButton = document.getElementById('cancelButton');
        
        // Tab elements
        this.tabs = document.querySelectorAll('.tab');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.totalCount = document.getElementById('totalCount');
        
        // List elements
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        
        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editTitle = document.getElementById('editTitle');
        this.editDescription = document.getElementById('editDescription');
        this.editDeadline = document.getElementById('editDeadline');
        this.closeModal = document.getElementById('closeModal');
        this.cancelEdit = document.getElementById('cancelEdit');
        
        // Date element
        this.currentDate = document.getElementById('currentDate');
    }
    
    attachEventListeners() {
        // Form events
        this.titleInput.addEventListener('input', () => this.handleTitleInput());
        this.titleInput.addEventListener('focus', () => this.showExpandedForm());
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.cancelButton.addEventListener('click', () => this.hideExpandedForm());
        
        // Tab events
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleTabChange(tab.dataset.tab));
        });
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.editForm.addEventListener('submit', (e) => this.handleEditTodo(e));
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeEditModal();
        });
    }
    
    updateDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.currentDate.textContent = now.toLocaleDateString('pl-PL', options);
    }
    
    handleTitleInput() {
        const hasTitle = this.titleInput.value.trim().length > 0;
        this.addButton.disabled = !hasTitle;
    }
    
    showExpandedForm() {
        this.expandedForm.style.display = 'block';
    }
    
    hideExpandedForm() {
        this.expandedForm.style.display = 'none';
        this.descriptionInput.value = '';
        this.deadlineInput.value = '';
    }
    
    handleAddTodo(e) {
        e.preventDefault();
        
        const title = this.titleInput.value.trim();
        if (!title) return;
        
        const newTodo = {
            id: this.generateId(),
            title: title,
            description: this.descriptionInput.value.trim(),
            deadline: this.deadlineInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(newTodo);
        this.saveTodos();
        this.resetForm();
        this.render();
    }
    
    handleEditTodo(e) {
        e.preventDefault();
        
        const title = this.editTitle.value.trim();
        if (!title || !this.editingTodo) return;
        
        const todoIndex = this.todos.findIndex(todo => todo.id === this.editingTodo.id);
        if (todoIndex !== -1) {
            this.todos[todoIndex] = {
                ...this.todos[todoIndex],
                title: title,
                description: this.editDescription.value.trim(),
                deadline: this.editDeadline.value
            };
            
            this.saveTodos();
            this.closeEditModal();
            this.render();
        }
    }
    
    handleTabChange(tab) {
        this.activeTab = tab;
        this.tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingTodo = todo;
            this.editTitle.value = todo.title;
            this.editDescription.value = todo.description;
            this.editDeadline.value = todo.deadline;
            this.editModal.classList.add('active');
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }
    
    closeEditModal() {
        this.editModal.classList.remove('active');
        this.editingTodo = null;
    }
    
    resetForm() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.deadlineInput.value = '';
        this.addButton.disabled = true;
        this.hideExpandedForm();
    }
    
    getFilteredTodos() {
        switch (this.activeTab) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }
    
    formatDeadline(dateString) {
        if (!dateString) return null;
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let text;
        if (diffDays === 0) text = 'Dziś';
        else if (diffDays === 1) text = 'Jutro';
        else if (diffDays === -1) text = 'Wczoraj';
        else if (diffDays < 0) text = `${Math.abs(diffDays)} dni temu`;
        else if (diffDays <= 7) text = `Za ${diffDays} dni`;
        else text = date.toLocaleDateString('pl-PL');
        
        const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
        if (hasTime) {
            text += ` ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return {
            text,
            isOverdue: diffDays < 0
        };
    }
    
    createTodoElement(todo) {
        const deadline = this.formatDeadline(todo.deadline);
        const isOverdue = deadline?.isOverdue && !todo.completed;
        
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        todoElement.innerHTML = `
            <button class="todo-checkbox ${todo.completed ? 'completed' : ''}" onclick="app.toggleTodo('${todo.id}')">
                ${todo.completed ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path></svg>' : ''}
            </button>
            <div class="todo-content">
                <h3 class="todo-title ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.title)}</h3>
                ${todo.description ? `<p class="todo-description ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.description)}</p>` : ''}
                ${deadline ? `
                    <div class="todo-deadline ${isOverdue ? 'overdue' : ''} ${todo.completed ? 'completed' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${isOverdue ? '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' : '<circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>'}
                        </svg>
                        <span>${deadline.text}</span>
                    </div>
                ` : ''}
            </div>
            <div class="todo-actions">
                <button class="action-button edit" onclick="app.editTodo('${todo.id}')" title="Edytuj">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                        <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-button delete" onclick="app.deleteTodo('${todo.id}')" title="Usuń">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        
        return todoElement;
    }
    
    render() {
        // Update counts
        const activeTodos = this.todos.filter(todo => !todo.completed);
        const completedTodos = this.todos.filter(todo => todo.completed);
        
        this.activeCount.textContent = activeTodos.length;
        this.completedCount.textContent = completedTodos.length;
        this.totalCount.textContent = this.todos.length;
        
        // Render todos
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                    </div>
                    <h3>Brak zadań</h3>
                    <p>Dodaj swoje pierwsze zadanie powyżej</p>
                </div>
            `;
        } else {
            this.todoList.innerHTML = '';
            filteredTodos.forEach(todo => {
                this.todoList.appendChild(this.createTodoElement(todo));
            });
        }
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
