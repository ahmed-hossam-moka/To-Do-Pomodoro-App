document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const toggleCompletedBtn = document.getElementById('toggleCompletedBtn');
    const taskList = document.getElementById('taskList');
    const timerDisplay = document.getElementById('timer');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const pauseTimerBtn = document.getElementById('pauseTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const pomodoroDuration = document.getElementById('pomodoroDuration');

    let timer;
    let defaultTime = 25 * 60;
    let timeLeft = defaultTime;
    let showCompleted = true;

    // Load tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToList(task.text, task.completed));

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    toggleCompletedBtn.addEventListener('click', () => {
        showCompleted = !showCompleted;
        updateTaskListVisibility();
        toggleCompletedBtn.textContent = showCompleted ? 'Hide Completed Tasks' : 'Show Completed Tasks';
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToList(taskText);
            saveTasks();
            taskInput.value = '';
        }
    }

    function addTaskToList(taskText, completed = false) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        if (completed) li.classList.add('completed');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');
        li.appendChild(taskSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(deleteBtn);
        li.addEventListener('click', (e) => {
            if (e.target !== deleteBtn) {
                li.classList.toggle('completed');
                saveTasks();
            }
        });

        taskList.appendChild(li);
        updateTaskListVisibility();
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskListVisibility() {
        Array.from(taskList.children).forEach(li => {
            const showTask = showCompleted || !li.classList.contains('completed');
            li.style.display = showTask ? '' : 'none';
        });
    }

    startTimerBtn.addEventListener('click', () => {
        const userSetTime = parseInt(pomodoroDuration.value);
        if (userSetTime && !timer) {
            timeLeft = userSetTime * 60;
        }
        if (!timer) {
            timer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timer = null;
                    alert('Time for a break!');
                    playSound();
                } else {
                    timeLeft--;
                    updateTimerDisplay();
                }
            }, 1000);
        }
    });

    pauseTimerBtn.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    });

    resetTimerBtn.addEventListener('click', () => {
        clearInterval(timer);
        timer = null;
        timeLeft = defaultTime;
        updateTimerDisplay();
    });

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function playSound() {
        const audio = new Audio('notification.mp3');
        audio.play();
    }

    updateTimerDisplay();
});