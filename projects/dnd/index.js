/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

// const homeworkContainer = document.querySelector('#app');
//
// document.addEventListener('mousemove', (e) => {});
//
// export function createDiv() {}
//
// const addDivButton = homeworkContainer.querySelector('#addDiv');
//
// addDivButton.addEventListener('click', function () {
//   const div = createDiv();
//   homeworkContainer.appendChild(div);
// });

const homeworkContainer = document.querySelector('#app');
const addDivButton = homeworkContainer.querySelector('#addDiv');



addDivButton.addEventListener('click', () => {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});


document.addEventListener('mousedown', function (event) {

  if (event.target.classList.contains('draggable-div')){

    let drDiv = event.target;


    drDiv.style.position = 'absolute';
    drDiv.style.zIndex = 1000;
    document.body.append(drDiv);

    moveAt(event.pageX, event.pageY);


    function moveAt(pageX, pageY) {
      drDiv.style.left = pageX - drDiv.offsetWidth / 2 + 'px';
      drDiv.style.top = pageY - drDiv.offsetHeight / 2 + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    drDiv.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', onMouseMove);
      drDiv.onmouseup = null;
    });
  }
});



export function createDiv() {

  const newDiv = document.createElement('DIV');
  newDiv.style.background = randomColor();
  newDiv.style.top = getRandomNumber(100, 200)+'px';
  newDiv.style.left = getRandomNumber(100, 200)+'px';
  newDiv.style.width =  getRandomNumber(100, 200)+'px';
  newDiv.style.height = getRandomNumber(100, 200)+'px';

  // newDiv.style.borderRadius = "50%";
  // newDiv.style.textAlign = "center";
  // newDiv.style.verticalAlign = "middle";
  newDiv.classList.add("draggable-div");
  // newDiv.style.position='absolute';

  return newDiv;
}




// function that returns a random number between a min and max
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  return 'rgb(' + (Math.floor(Math.random() * 256)) + ','
    + (Math.floor(Math.random() * 256)) + ','
    + (Math.floor(Math.random() * 256)) + ')';
}
