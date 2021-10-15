/* ДЗ 5 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунд

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {

    // Создаётся объект promise
    let promise = new Promise((resolve, reject) => {

        setTimeout(() => {
            // переведёт промис в состояние fulfilled с результатом "result"
            resolve("result");
        }, seconds*1000);

    });
    return promise;

}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {

    let promise = new Promise((resolve, reject) => {

        let result = fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => (a.name > b.name) ? 1 : (b.name > a.name) ? -1 : 0)
                resolve(data);
            });
    });
    return promise;
}

export { delayPromise, loadAndSortTowns };
