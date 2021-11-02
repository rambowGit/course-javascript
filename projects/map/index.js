import './index.html';
import './css/normalize.css';
import './css/style.css';
import './helper';
import {baloonTemplate, storage, slideshowTemplateHeader, slideshowTemplateBody, slideshowTemplateFooter} from "./helper";


/*
 Получаем ранее оставленные placemarks из localstorage:
 const data = JSON.parse(localStorage.mapData); - общий скоуп данных
 data[i] - данные конкретной точки, включая координаты и отзыв
 let formData = JSON.parse(data[i].balloonForm)
 */

// данные
const pointStorage =  JSON.parse(localStorage.mapData || '[]');
// массив объектов, в котором хранятся новые точки на карте
let newPoints = [];
// глобальная переменная для хранения заполненной формы балуна и балуна метки
let balloonForm = {};
// флаги, для проверки - с каким их балунов мы работает: просто балун, или балун метки
let isNewBallon;
let isPointBalloon;
// глобальная переменная для хранения координат разных геообъектоа
let coords = [];
// адрес для балуна точки и балуна кластера
let address = 'не определено';




window.addEventListener('DOMContentLoaded', (event) => {

  ymaps.ready(function () {
    let myMap = new ymaps.Map('map', {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag', 'scrollZoom']
      },
      {
        searchControlProvider: 'yandex#search'
      }),


      /*
       Карусель
       https://yandex.ru/dev/maps/jsbox/2.1/cluster_balloon_carousel/
       */
      // Создаем собственный макет с информацией о выбранном геообъекте.
      customItemContentLayout = ymaps.templateLayoutFactory.createClass(
      // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
      '<small style="background: #e8e7ca">{{ properties.balloonContentHeader|raw }}</small>' +
      // '<div>{{ properties.balloonContentBody|raw }}</div>' +
      '<div>{{ properties.balloonContentFooter|raw }}</div>'
    ),


      /**
       * Создадим кластеризатор, вызвав функцию-конструктор.
       * Список всех опций доступен в документации.
       * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#constructor-summary
       */
    clusterer = new ymaps.Clusterer({
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: true,
      // Устанавливаем стандартный макет балуна кластера "Карусель".
      clusterBalloonContentLayout: 'cluster#balloonCarousel',
      // Устанавливаем собственный макет.
      clusterBalloonItemContentLayout: customItemContentLayout,
      // Устанавливаем режим открытия балуна.
      // В данном примере балун никогда не будет открываться в режиме панели.
      clusterBalloonPanelMaxMapArea: 0,
      // Устанавливаем размеры макета контента балуна (в пикселях).
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 130,
      // Устанавливаем максимальное количество элементов в нижней панели на одной странице
      clusterBalloonPagerSize: 5
      // Настройка внешнего вида нижней панели.
      // Режим marker рекомендуется использовать с небольшим количеством элементов.
      // clusterBalloonPagerType: 'marker',
      // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
      // clusterBalloonCycling: false,
      // Можно отключить отображение меню навигации.
      // clusterBalloonPagerVisible: false
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

       /*
        Предыдущие отзывы.
        Handlebars.compile возвращает функцию, принимающую, например, объект.
        */
        const pointBaloonTemplate = Handlebars.compile(
          '{{#each comments}}' +
          '<li><b>Имя: {{"userName"}}</b></li>'+
          '<li>Место: {{"mapLocation"}}</li>'+
          '<li>Отзыв: {{"userComment"}}</li>'+
          '<hr>'+
          '{{/each}}'
        );


        return {
          balloonContentHeader: address,
          balloonContentBody:  baloonTemplate,
          balloonContentFooter: '<span style="font-size: xx-small; ">Информация предоставлена: </span> балуном <strong>метки ' +index +'</strong><br>'+
                                '<span style="font-size: xx-small; ">' +
                                 pointBaloonTemplate(data)
                                  +'</span>'
        };
      },

      myPoints = [];

    /**
     * Данные передаются вторым параметром в конструктор метки, опции - третьим.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Placemark.xml#constructor-summary
     */

    // устанавливаем из localstorage метки на карте
    for(var i = 0, len = pointStorage.length; i < len; i++) {

      coords = pointStorage[i]['coords'];

      let renderData = {
        comments : []
      };

      pointStorage[i]['balloonForm'].forEach(arrayOfComments => {
          renderData.comments.push(arrayOfComments);
          console.log(renderData);

        });

      myPoints[i] = createPlacemark(coords, getPointData(i, renderData));

      // получаем адрес точки и записываем его в балун
      getAddress(coords, myPoints[i]);

    }


    /**
     * В кластеризатор можно добавить javascript-массив меток (не геоколлекцию) или одну метку.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Clusterer.xml#add
     */
    clusterer.add(myPoints);
    myMap.geoObjects.add(clusterer);

    /**
     * Спозиционируем карту так, чтобы на ней были видны все объекты.
     */

    if (myPoints.length > 0) {
      myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
      });
    }



    /*
     клики по карте, создание балуна
     */

    myMap.events.add('click', function (event) {
      // при сабмите формы, нужно понять - это новый балун или балун метки
      isNewBallon = true;

      // Получение координат щелчка
      coords = event.get('coords');
      console.log('координаты клика:', coords);

      // открываем новый балун
      myMap.balloon.open(coords, {
        //здесь доработать код вывода формы ввода
        contentBody: baloonTemplate,
      });

    });


    /*
     сохранение формы балуна метки
     */
    myPoints.forEach(point => {

      point.balloon.events.add('open', function (e) {
        // Получение координат метки
        coords = point.geometry.getCoordinates();
        console.log("coords: ", coords);

        // при сабмите формы, нужно понять - это новый балун или балун метки
        isPointBalloon = true;

      });
    });



    /*
      Получение html-формы балуна
    */
      document.addEventListener('submit', (e) => {
        // e.preventDefault();
        if (e.target.classList.contains('balloon_container')) {
          console.log ('сабмит балуна');
          let userNameEl = document.querySelector('#name');
          let mapLocationEl = document.querySelector('#location');
          let userCommentEl = document.querySelector('#comment_text');

          // if(!userNameEl.value || !mapLocationEl.value || !userCommentEl.value) {
          //   alert('Пожалуйста, заполните все поля на форме.');
          //   return
          // }

          balloonForm = {
            userName: userNameEl.value,
            mapLocation: mapLocationEl.value,
            userComment: userCommentEl.value
          };

          // проверяем, что это новый балун, пока без метки
          if (isNewBallon){
            saveNewPoint(balloonForm, coords);
            isNewBallon = false;
          }

          // если обновляем балун метки
          if (isPointBalloon){
            updatePointBallon(balloonForm);
            isPointBalloon = false;
          }
        }
    });



    /*
    сохранение новой точки с новым балуном localstorage
     */
    function saveNewPoint(balloonForm, coords) {

      // добавляем новую метку
      let newPoint = createPlacemark(coords);

      myMap.geoObjects.add(newPoint);

      /*
       тут храняться текущие плейсмарки, еще не сохраненные в local storage
       coords берутся выше: coords = event.get('coords');
       */
      newPoints.push({
        coords: coords,
        balloonForm: [balloonForm]
      });

      // записываем массих текущих placemarks в localstorage
      const concatPlacemarks = [...newPoints, ...pointStorage];
      storage.mapData = JSON.stringify(concatPlacemarks);

    }

    /*
    обновление балуна уже имеющейся точки
     */
    function updatePointBallon(balloonForm) {

      pointStorage.forEach( point => {

        // coords берутся выше: coords = point.geometry.getCoordinates();
        if (point["coords"] === coords) {
          console.log(point['coords']);

          point['balloonForm'].push(balloonForm);
          storage.mapData = JSON.stringify(pointStorage);
        }
      });
    }


    /*
     Создание метки.
     */
    function createPlacemark(coords, fn) {
      return new ymaps.Placemark(coords, fn);
    }



    /*
     Определяем адрес по координатам (обратное геокодирование).
     */
    function getAddress(coords, myPlacemark) {
      ymaps.geocode(coords).then(function (res) {
        let firstGeoObject = res.geoObjects.get(0);
        address = firstGeoObject.getAddressLine();

        myPlacemark.properties
          .set({
            // В заголовке балуна задаем строку с адресом объекта.
            balloonContentHeader: firstGeoObject.getAddressLine()
          });
      });
    }

  });


});

