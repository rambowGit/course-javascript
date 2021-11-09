import './index.html';
import './css/normalize.css';
import './css/style.css';
import './helper';
import {baloonTemplate, storage} from "./helper";


// массив объектов, в котором хранятся новые точки на карте
const newPlacemarks = [];

// получаем ранее оставленные placemarks из localstorage
const placemarksLocalStorage =  JSON.parse(storage.placemarkData || '{}');

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  ymaps.ready(init);

});



function init() {
  let myMap = new ymaps.Map('map', {
    center: [59.94, 30.32],
    zoom: 12,
    controls: ['zoomControl'],
    behaviors: ['scrollZoom', 'drag']
  });




  placemarksLocalStorage.forEach( pointObj => {

    let placemark = new ymaps.Placemark(pointObj.coords, {
      hintContent: pointObj.hintContent,
      balloonContentBody: pointObj.baloonForm
    });

    myMap.geoObjects.add(placemark);
  });





  // клики по карте
  myMap.events.add('click', function (e) {
    // Получение координат щелчка
    let coords = e.get('coords');
    let newPlacemark = new ymaps.Placemark(coords, {
      hintContent: '<div class="map__hint">Оставьте отзыв</div>',
      balloonContent: baloonTemplate
    });

    myMap.geoObjects.add(newPlacemark);

    // тут храняться текущие плейсмарки, еще не сохраненные в local storage
    newPlacemarks.push({
      coords: coords,
      hintContent: newPlacemark.hintContent,
      balloonContent: newPlacemark.balloonContent
    });

    // записываем массих текущих placemarks в localstorage
    const concatPlacemarks = [...newPlacemarks, ...placemarksLocalStorage];
    storage.placemarkData = JSON.stringify(concatPlacemarks);

    console.log("storage.placemarkData: ", storage.placemarkData);
  });




}




