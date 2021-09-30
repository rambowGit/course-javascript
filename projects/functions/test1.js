/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию

 Пример:
   function sum(a, b) {
     return a + b;
   }

   var newSum = bindFunction(sum, 2, 4);

   console.log(newSum()) выведет 6
 */

var calc = {
    a: 2,
    b: 4,
    sum: function () {
        console.log(this.a + this.b);

    }
};

var newCalc = calc.sum();
newCalc;
