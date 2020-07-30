# sprint-15
______________________
__version 0.0.2__

## Проектная работа №15: Реализуем деплой бэкенда на внешний веб-сервер

### Ссылки на проект:

- публичный IP-адрес: `130.193.35.216`
- доменное имя: `https://mesto-app.cf`

### Основные технологии используемые в этом проекте:

- JavaScript
- Node.js
- express.js
- MongoDB
- Mongoose
- nginx
- Яндекс.Облако

### Функционал проекта:

- реализована централизованная обработка ошибок;
- реализовано логирование запросов, ответов ошибок, запросы и ответы записываются в файл request.log, ошибки записываются в файл error.log, файлы логов не добавляются в репозиторий;
- в проекте секретный ключ для создания и верификации JWT хранится на сервере в .env-файле, который не добавляется в git;
- реализовано самостоятельное восстановление сервера после GET-запроса на URL `/crash-test`.

### Версии:

v 0.0.1: Старт

