/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
// const homeworkContainer = document.querySelector('#app');
// // текстовое поле для фильтрации cookie
// const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// // текстовое поле с именем cookie
// const addNameInput = homeworkContainer.querySelector('#add-name-input');
// // текстовое поле со значением cookie
// const addValueInput = homeworkContainer.querySelector('#add-value-input');
// // кнопка "добавить cookie"
// const addButton = homeworkContainer.querySelector('#add-button');
// // таблица со списком cookie
// const listTable = homeworkContainer.querySelector('#list-table tbody');
//
// filterNameInput.addEventListener('input', function () {});
//
// addButton.addEventListener('click', () => {});
//
// listTable.addEventListener('click', (e) => {});

const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// фильтрация
function isMatching(full, chunk) {
  return full.toLowerCase().includes(chunk.toLowerCase());
}

//обновление DOM списком городов, который вернул фильтр updateFilter
function updateFilter(filterValue) {
  // получение всех cookies
  const cookies = getCookies();

  const fragment = document.createDocumentFragment();
  fragment.innerHTML = ''; // иначе fragment.innerHTML == undefined в первой строке таблицы

  for (const key in cookies) {
    if (filterValue && isMatching(key, filterValue)) {
      fragment.innerHTML += `<tr>
                <td>${key}</td>
                <td>${cookies[key]}</td>
                <td><button class = 'deleteButton'>Delete</button></td>            
            </tr>`;
    }
  }

  if (fragment.innerHTML === '') {
    createCookieTable(cookies, filterValue);
  } else {
    console.log('fragment.innerHTML: ', fragment.innerHTML);
    listTable.innerHTML = fragment.innerHTML;
  }
}

/*
 список кук в виде объекта
 */
function getCookies() {
  return document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
  }, {});
}

// верстка таблицы
function createCookieTable(cookieObject, filterValue) {
  console.log('filterValue: ', filterValue);

  listTable.innerHTML = '';

  for (const key in cookieObject) {
    if (!key) return;
    //если кук нет
    else if (filterValue && isMatching(key, filterValue)) {
      // таблицу добавляем только то, что соответствует фильтру

      console.log('1: ', isMatching(key, filterValue));

      listTable.innerHTML += `<tr>
                    <td>${key}</td>
                    <td>${cookieObject[key]}</td>
                    <td><button class = 'deleteButton'>Delete</button></td>            
                </tr>`;
    } else if (filterValue === undefined || !filterValue) {
      // если нет фильтра
      console.log('2: no filter');

      listTable.innerHTML += `<tr>
                    <td>${key}</td>
                    <td>${cookieObject[key]}</td>
                    <td><button class = 'deleteButton'>Delete</button></td>            
                </tr>`;
    } else {
      console.log('3: ', cookieObject);
    }
  }
}

/*
 удаление cookie
 */
function deleteCookie(name) {
  const domain = location.hostname,
    path = '/'; // root path

  document.cookie = [
    name,
    '=',
    '; expires=' + new Date(0).toUTCString(),
    '; path=' + path,
    '; domain=' + domain,
  ].join('');
}

/*
 удаление строки из таблицы
 */
function removeRowAndCookie(event) {
  if (!event.target.classList.contains('deleteButton')) return;

  // кнопка удаления
  const delBtnEl = event.target;
  // удаление cookie
  const cookieKey = delBtnEl.closest('tr').firstElementChild.innerHTML;
  deleteCookie(cookieKey);
  // удаление строки
  delBtnEl.closest('tr').remove();
}

/*
добавление новой cookie
 */

function createCookie() {
  // фильтр
  const filterValue = filterNameInput.value;

  document.cookie = `${addNameInput.value}=${addValueInput.value}`;
  addNameInput.value = '';
  addValueInput.value = '';

  // получение всех cookies
  const cookies = getCookies();
  // перерисовываем таблицу с куками
  createCookieTable(cookies, filterValue);
}

// получение всех cookies
const cookies = getCookies();
// создаем таблицу из кук
createCookieTable(cookies, filterNameInput.value);
// удаляем строку с кукой из таблицы и куку из браузера
listTable.addEventListener('click', removeRowAndCookie);
// добавление cookie
addButton.addEventListener('click', createCookie);
//обновление таблицы результатом фильтра
filterNameInput.addEventListener('input', function () {
  updateFilter(this.value);
});
