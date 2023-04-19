# Проект Mesto фронтенд + бэкенд

Данный проект является одностраничным веб-сайтом, который дает пользователю возможность отобразить контент, включающий фотографии и названия мест, которые на них отображены, а так же оценивать при помощи кнопки "Понравилось". Помимо того, информацию в профиле сайта можно менять в модальном окне, которое открывается по нажатию на кнопку "Редактировать".

## В ходе создания проектной работы применяются такие технологии и инструменты как

* Flexbox верстка.
* Grid-layout.
* Адаптивная верстка для различных разрешений экранов устройств.
* Метолодогия БЭМ, в том числе Nested БЭМ для построения файловой структуры сайта.
* Применение семантических тегов для помощи в использовании вэб-сайта лицам с ограниченными возможностями.
* Язык программирования Java Script.
* Cистема контроля версий Git.
* ООП.
* Node.js(express)
* Использование Mongo DB + Compass
* Postman

Верстка проекта создана при помощи HTML5 и CSS3 версий. Функционал реализован при помощи JavaScript.

На данном этапе создан собственный сервер с собственной базой данных, к данным можно обращаться при помощи API-запросов. При создании сервера использовалось построение схем, реализация роутов и контроллеров, реализована обработка ошибок.

Статус проекта: в разработке. В ближайшее время планируется подключить фронтенд часть к серверу, а так же авторизацию и регистрацию пользователей.

* [Ссылка на проект](https://sergeyklopov94.github.io/express-mesto-gha/)

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер
`npm run dev` — запускает сервер с hot-reload
