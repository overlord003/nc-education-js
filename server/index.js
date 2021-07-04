const express = require('express');
const body = require('body-parser');
const cors = require('cors');

// TODO create es6 class

const app = express();
app.use(body.json());

// TODO build up cors
app.use(cors({origin: '*'}));


// TODO

//  /signup (post запоминаем пользователя, выставляем куки -> 201 created)
//  /login (если у нас есть пользователь, высталяем куки -> 200)
//  /me (парсим куки - если сессионной куки нет -> 401 Unauthorized, иначе возвращаем пользователя)
//  /logout (сбрасываем куки)

const port = process.env.PORT || 8002;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
