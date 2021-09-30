/*
 Задание 3:

 Функция должна принимать другую функцию и возвращать результат вызова этой функции

 Пример:
   returnFnResult(() => 'привет') вернет 'привет'
 */


   function returnFnResult(func) {
    func();
  }

  function fn2(){
    return 'Hello world!';
  }
  
  console.log(returnFnResult(fn2));