## Интенрнет-магазин (Frontend)
Проект представляет собой Frontend часть  Интренет-магазина, Backend можно запустить перейдя по ***https://github.com/Vladislav3421730/OnlineStoreMicroservicesBackend***
Далее будет инструкция по запуску, и описание используемых технологий в проекте
# Инструкция по запуску
Для начала проект нужно скопировать себе локально на компьютер
```bash
git clone https://github.com/Vladislav3421730/OnlineStoreMicroservicesFrontend
```
Затем перейти в папку проекта 
```bash
cd OnlineStoreMicroservicesFrontend
```
Затем запустить команду Docker
```bash
docker compose up
```
После этого приложение откроется и им можно пользоваться перейдя по ссылке
```bash
http://localhost:3000
```
# Используемые технологии
Во Frontend части используется React и ***react-router-dom***. Для взаимодействия с backend используется axios и axios interceptors для получения нового access token по refresh токену.
Используется адаптивная и grid вёрстки. Сделана пагинация, присутствуют модальные окна, страницы с ошибками 403, 404.
