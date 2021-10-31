import './index.html';
import './css/normalize.css';
import './css/style.css';
import './helper';
import {baloonTemplate, storage, placemarkBaloonTemplate} from "./helper";


/*
 Получаем ранее оставленные placemarks из localstorage:
 const data = JSON.parse(localStorage.placemarkData); - общий скоуп данных
 data[i] - данные конкретной точки, включая координаты и отзыв
 let formData = JSON.parse(data[i].balloonForm)
 или
 let formData = JSON.parse(data[i].balloonForm[j])

 */

// данные
const placemarksLocalStorage =  JSON.parse(localStorage.placemarkData || '[]');
// массив объектов, в котором хранятся новые точки на карте
let newPlacemarks = [];
// форма отзыва их балуна
let balloonForm;


window.addEventListener('DOMContentLoaded', (event) => {

  ymaps.ready(function () {
    let myMap = new ymaps.Map('map', {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag', 'scrollZoom']
      }, {
        searchControlProvider: 'yandex#search'
      }),
      /**
       * Создадим кластеризатор, вызвав функцию-конструктор.
       * Список всех опций доступен в документации.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
       */
      clusterer = new ymaps.Clusterer({

        /**
         * Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
         */
        groupByCoordinates: false,

      }),
      /**
       * Функция возвращает объект, содержащий данные метки.
       * Поле данных clusterCaption будет отображено в списке геообъектов в балуне кластера.
       * Поле balloonContentBody - источник данных для контента балуна.
       * Оба поля поддерживают HTML-разметку.
       * Список полей данных, которые используют стандартные макеты содержимого иконки метки
       * и балуна геообъектов, можно посмотреть в документации.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeoObject.xml
       */
      getPointData = function (index, data) {

       // предыдущие отзывы
        const pointBaloonTemplate = Handlebars.compile(
          '{{#each balloonForm}}' +
          '<li>Имя: {{"userName"}}</li>'+
          '<li>Место: {{"mapLocation"}}</li>'+
          '<li>Отзыв: {{"userComment"}}</li>'+
          '<hr>'+
          '{{/each}}'
        );
        return {
          balloonContentBody:  placemarkBaloonTemplate,
          balloonContentFooter: '<span style="font-size: xx-small; ">Информация предоставлена: </span> балуном <strong>метки ' +index +'</strong><br>'+
                                '<span style="font-size: xx-small; ">' +
                                 pointBaloonTemplate(data)
                                  +'</span>'
        };
      },

      myGeoObjects = [];

    /**
     * Данные передаются вторым параметром в конструктор метки, опции - третьим.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
     */

      // объект для хранения предыдущих отзывов


    for(var i = 0, len = placemarksLocalStorage.length; i < len; i++) {

      let baloonData = {
        balloonForm : []
      };


      let point = placemarksLocalStorage[i];
      console.log("point: ", point);

      point['balloonForm'].forEach(arrayOfComments => baloonData.balloonForm.push(arrayOfComments));

      console.log('baloonData of point: ', baloonData);


     // устанавливаем из localsorage метки на карте
      myGeoObjects[i] = new ymaps.Placemark(point['coords'], getPointData(i, baloonData));


      // клики по метке - пока не используем
      // myGeoObjects[i].events.add('click', function (e) {
      //  // alert(formData);
      // });

      // сохранение формы балуна метки
      myGeoObjects[i].balloon.events.add('open', function (e) {


        /*
          Сохранение данных балуна (отзыв) в localstorage.
          Добавление метки.
        */
        document.addEventListener('submit', e =>{
          //e.preventDefault();
          let pointBalloonForm;

          let userNameEl = document.querySelector('#name');
          let mapLocationEl = document.querySelector('#location');
          let userCommentEl = document.querySelector('#comment_text');

          if(!userNameEl.value || !mapLocationEl.value || !userCommentEl.value)
            alert('Пожалуйста, запоните все поля на форме.');

          pointBalloonForm = {
            userName: userNameEl.value,
            mapLocation: mapLocationEl.value,
            userComment: userCommentEl.value
          };


          if (pointBalloonForm !== undefined) {

           // добавляем в localstorage новый отзыв
           point['balloonForm'].push(pointBalloonForm);

            // записываем массив текущих placemarks в localstorage
            const concatPlacemarks = [...newPlacemarks, ...placemarksLocalStorage];
            storage.placemarkData = JSON.stringify(concatPlacemarks);
          }

        });

      });

    }

    /**
     * Можно менять опции кластеризатора после создания.
     */
    clusterer.options.set({
      clusterDisableClickZoom: true
    });

    /**
     * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
     */
    clusterer.add(myGeoObjects);
    myMap.geoObjects.add(clusterer);

    /**
     * Спозиционируем карту так, чтобы на ней были видны все объекты.
     */

    if (myGeoObjects.length > 0) {
      myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
      });
    }





    // клики по карте
    myMap.events.add('click', function (event) {

      // Получение координат щелчка
      let coords = event.get('coords');
      console.log('координаты клика:', coords);

      // если балун закрыли, удаляем координаты, иначе появится placemark
      // myMap.balloon.events.add('close', (e) => {
      //   coords = [];
      //   console.log("coords: ", coords);
      //
      // });
      //

      // открываем новый балун
      myMap.balloon.open(coords, {
        //здесь доработать код вывода формы ввода
        contentBody: baloonTemplate
      });

      /*
       Сохранение данных балуна (отзыв) в localstorage.
       Добавление метки.
      */
      document.addEventListener('submit', e =>{
       // e.preventDefault();

        let userNameEl = document.querySelector('#name');
        let mapLocationEl = document.querySelector('#location');
        let userCommentEl = document.querySelector('#comment_text');

        if(!userNameEl.value || !mapLocationEl.value || !userCommentEl.value)
          alert('Пожалуйста, запоните все поля на форме.');


        balloonForm = {
          userName: userNameEl.value,
          mapLocation: mapLocationEl.value,
          userComment: userCommentEl.value
        };


        // добавляем новую метку
        let newPlacemark = new ymaps.Placemark(coords, {

        });

        myMap.geoObjects.add(newPlacemark);
        console.log('метка добавлена: ', event.get('coords'));

        // тут храняться текущие плейсмарки, еще не сохраненные в local storage
        newPlacemarks.push({
          coords: coords,
          balloonForm: [balloonForm]
        });

        // записываем массих текущих placemarks в localstorage
        const concatPlacemarks = [...newPlacemarks, ...placemarksLocalStorage];
        storage.placemarkData = JSON.stringify(concatPlacemarks);


      });

    });

  });


});

