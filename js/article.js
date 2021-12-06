let article_content__text = document.getElementById("article_content__text");
let article_name_articlePage = document.getElementById("article_name_articlePage");
let articlePage_author = document.getElementById("articlePage_author");
let articlePage_date = document.getElementById("articlePage_date");
let articlePage_image = document.getElementById("articlePage_image");


let visited = localStorage.getItem("viseted")
let response_article = JSON.parse(localStorage.getItem("response")).filter(el=>el.id == visited)[0]
console.log(visited, response_article)

article_content__text.innerHTML = response_article.fields.bodyText
article_name_articlePage.innerHTML = response_article.webTitle
articlePage_author.innerHTML = response_article.fields.byline
articlePage_date.innerHTML = response_article.webPublicationDate
articlePage_image.setAttribute('src', response_article.fields.thumbnail)