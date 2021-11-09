import './index.html';

const button = document.querySelector('#my-button');
const result = document.querySelector('#my-result');

button.addEventListener('click', () => {
  console.log(result);
  result.innerHTML = 42;
});
