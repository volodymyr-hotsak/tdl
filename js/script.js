const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();



/*To do list*/

const form = document.querySelector('#form'),
      taskInput = document.querySelector('#taskInput'),
      tasksList = document.querySelector('.tasksList'),
      emptyList = document.querySelector('.emptyList');
  
//part 2 Local storage
let tasks = [];

//Перевірка чи в LocalStorage є дані

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    //Виводимо tasks на екран
    tasks.forEach(task => {
    renderTask(task);
});
}



checkEmptyList();

//Додавання завдання
form.addEventListener('submit', addTask);

//Видалення завдання
tasksList.addEventListener('click', deleteTask);

//Завдання виконане
tasksList.addEventListener('click', doneTask);

function addTask(e) {
  //відміна обробки форми
  e.preventDefault();

  //отримуємо значення інпута
  const taskText = taskInput.value;

  //part2 описуємо об*єкт для нашої задачі
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //part2 добавляємо задачу в масив з завданями
  tasks.push(newTask);

  //Додаємо в LocalStorage
  saveToLocalStorage();

  renderTask(newTask);



  //очищаємо інпут
  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
  
} 

function deleteTask(e) {
    //якщо click був не по кнопці видалити задачу
    if(e.target.dataset.action !== 'delete') {
      return
    }

     //робить пошук родичів кнопки - closest
    const parentNode = e.target.closest('.list-group-item');

    //уточнюємо яка id завдання
    const id = Number(parentNode.id);

    //Шукаємо індекс завадння і удаляємо по індексу
    const index = tasks.findIndex(function (task) {
      if(task.id === id) {
        return true;
      }
    });

    //удаляємо завдання з масива
    tasks.splice(index, 1);

    //Додаємо в LocalStorage
    saveToLocalStorage();
    
    parentNode.remove();

    /*Метод за допомогою фільтрів видалення завдання
    tasks = tasks.filter(function (task) {
      if(task.id === id) {
        return false
      } else {
        return true
      }
    });
     tasks = tasks.filter((task) => task.id !== id);
    */
     checkEmptyList();
}

function doneTask(e) {
  //Якщо click був не по кнопці done

  if (e.target.dataset.action !== 'done') return;

  const parentNode = e.target.closest('.list-group-item');
  
  //Зноходимо id завдання
  const id = Number(parentNode.id);

  //знаходимо завдання в масиві з задачами
  const task = tasks.find( (task) => task.id === id);

  task.done = !task.done;

  //Додаємо в LocalStorage
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.list-group-span');
  taskTitle.classList.toggle('list-group-span--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
      <li class="emptyList">
        <img class="empty-list-img" src="./img/leaf-svgrepo-com.svg" alt="">
        <div class="empty-list-title">Список справ пустий</div>
      </li>`;
    
      tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  };

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('.emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}


function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
   //part 2 логіка яка буде добавляти class в розмітку done
   const cssCLass = task.done ? "list-group-span list-group-span--done" : "list-group-span";

   //Створюємо розмітку для задачі
   const taskHTML = `
       <li id="${task.id}" class="list-group-item">
         <span class="${cssCLass}">${task.text}</span>
         <div class="task-item-buttons">
             <button type="button" data-action="done" class="btn-action">
                   <img src="./img/icons/checked.svg" alt="Done">
             </button>
             <button type="button" data-action="delete" class="btn-action">
                   <img src="./img/icons/remove.svg" alt="Delete">
             </button>
         </div>
     </li>
   `;
 
   //Додаємо taskHTML на сторінку
   tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
