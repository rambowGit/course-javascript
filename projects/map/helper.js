
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


export const slideshowTemplateHeader = `
<div class="container">
    <div class='row'>
        <div class='col-md-offset-2 col-md-8'>
            <div class="carousel slide" data-ride="carousel" id="quote-carousel">
                <div class="carousel-inner">
                    <!-- Quote 1 -->
                    <div class="item active">
                        <blockquote>
                            <div class="row">
                                <div class="col-sm-9">
                                    <p>`;

export const slideshowTemplateBody = `                                  
                                     <li>Место: {{"mapLocation"}}</li>
                                     <li>Отзыв: {{"userComment"}}</li>
                                     <small>{{"userName"}}</small>
                                    <!-- Carousel Buttons Next/Prev -->
                                  <a data-slide="prev" href="#quote-carousel" class="left carousel-control"> <i class="fa fa-chevron-left"></i></a>
                                  <a data-slide="next" href="#quote-carousel" class="right carousel-control"> <i class="fa fa-chevron-right"></i></a>`;

export const slideshowTemplateFooter = `
                                    </p>
                                </div>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
