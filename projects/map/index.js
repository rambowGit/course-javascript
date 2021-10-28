import './index.html';
import './css/normalize.css';
import './css/style.css';


window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  ymaps.ready(init);
});


const baloonForm = `
<form class = "balloon_container">
    <div class="comment_header">
        Отзыв:
    </div>
    <div >
        <input  class="name" type = "text" name = "userName" placeholder="Укажите ваше имя"></div>
    </div>
    <div  >
            <input class = "location" type = "text" name = "mapLocation" placeholder="Укажите место">
    </div>
    <div >
            <input class = "comment_text" type = "text" name = "userComment" placeholder="Оставить отзыв">
    </div>
    <div>
            <button class = "submit_btn">Добавить</button>
    </div>
</form>
`;


function init() {
  let myMap = new ymaps.Map('map', {
    center: [59.94, 30.32],
    zoom: 12,
    controls: ['zoomControl'],
    behaviors: ['drag']
  });


  let placemark = new ymaps.Placemark([59.97, 30.31], {
    hintContent: '<div class="map__hint">ул. Литераторов, д. 19</div>',
    balloonContent: baloonForm
  });

  myMap.geoObjects.add(placemark);



  // клики по карте
  myMap.events.add('click', function (e) {
    // Получение координат щелчка
    let coords = e.get('coords');
    let newPlacemark = new ymaps.Placemark(coords, {
      hintContent: '<div class="map__hint">Оставьте отзыв</div>',
      balloonContent: baloonForm
    });
    myMap.geoObjects.add(newPlacemark);

  });


}


function newPlacemark() {
  
}




