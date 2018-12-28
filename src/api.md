EST API, в случае успеха возвращается структура вида:

{
    code: "OK",
    data: ...
}
А в случае ошибки возвращается структура:

{
    code: "ERROR",
    comment: ... // опционально
}
Список команд API:

Получение метаданных каталога

Тип запроса: GET

URL запроса: /resources/api/directory/metadata

Параметры:

path - относительный путь к каталогу (опционально), по умолчанию корень раздела ресурсов
/resources/api/directory/metadata  Expand source
Создание каталога

Тип запроса: PUT

URL запроса: /resources/api/directory/create

Параметры:

path - путь к каталогу, где нужно создать новый каталог
name - название нового каталога
Копирование файла

Тип запроса: POST

URL запроса: /resources/api/resource/copy

Параметры:

from - относительный путь к копируемому ресурсу
to - относительный путь к каталогу размещения копируемого ресурса
Перемещение файла

Тип запроса: POST

URL запроса: /resources/api/resource/move

Параметры:

from - относительный путь к перемещаемому ресурсу
to - относительный путь к каталогу размещения перемещаемого ресурса
Удаление ресурса

Тип запроса: DELETE

URL запроса: /resources/api/resource/delete

Параметры:

path - относительный путь к ресурсу
Загрузка файла

Тип запроса: POST

URL запроса: /resources/api/resource/upload

Параметры:

path - относительный путь "куда"
files[] - загружаемый файл
width - максимальная ширина картинки (опционально, применяется только для загружаемых картинок)
height - максимальная высота картинки (опционально, применяется только для загружаемых картинок)
Арихивирование ресурсов

Тип запроса: GET

URL запроса: /resources/api/resource/zip

Параметры:

path[] - относительный путь к ресурсу
/resources/api/resource/zip