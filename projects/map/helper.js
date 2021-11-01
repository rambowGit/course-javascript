
export const storage = localStorage;

/*
этот шаблон используется для балуна при клике по карте
 */
export const baloonTemplate = `
<form class = "balloon_container">
    <div class="comment_header">
        Отзыв:
    </div>
    <div >
        <input  class="name" id="name" type = "text" name = "userName" placeholder="Укажите ваше имя"></div>
    </div>
    <div  >
            <input class = "location" id = "location" type = "text" name = "mapLocation" placeholder="Укажите место">
    </div>
    <div >
            <input class = "comment_text" id = "comment_text" type = "text" name = "userComment" placeholder="Оставить отзыв">
    </div>
    <div>
            <button class = "submit_btn" id = "submit_btn" type = "submit">Добавить</button>
    </div>
</form>`;

