/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   forEach([1, 2, 3], (el) => console.log(el))
 */
function forEach(array, callbackFn) {
  for (let i = 0; i < array.length; i++) {
    callbackFn(array[i], i, array);
  }
}

// const array = [1, 2, 3, 4, 5];
// forEach(array, (el, el2, el3) => console.log(el, el2, el3));

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   map([1, 2, 3], (el) => el ** 2) // [1, 4, 9]
 */
function map(array, fn) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    fn(array[i], i, array);
    newArray.push(array[i] ** 2);
  }

  return newArray;
}
// var result = map([1, 2, 3], (el) => el**2);
// console.log(result);

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   reduce([1, 2, 3], (all, current) => all + current) // 6
 */
function reduce(array, fn, initial) {
  let sum;
  if (initial) {
    sum = initial;

    for (let i = 0; i < array.length; i++) {
      fn(sum, array[i], i, array);
      // console.log(sum);
      sum = sum + array[i];
    }
  } else {
    sum = array[0];
    for (let i = 1; i < array.length; i++) {
      fn(sum, array[i], i, array);
      // console.log(sum);
      sum = sum + array[i];
    }
  }
  return sum;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
  const capsArray = [];

  for (const field in obj) {
    capsArray.push(field.toUpperCase());
  }
  return capsArray;
}
/*
 Задание 5 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат

 Пример:
   const obj = createProxy({});
   obj.foo = 2;
   console.log(obj.foo); // 4
 */
function createProxy(obj) {
  obj = new Proxy(obj, {
    set(target, prop, val) {
      if (typeof val == 'number') {
        target[prop] = val * val;
        return true;
      } else {
        return false;
      }
    },
  });
  return obj;
}
export { forEach, map, reduce, upperProps, createProxy };
