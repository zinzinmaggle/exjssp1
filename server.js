import express from 'express'
import bodyParser from 'body-parser';
import * as io from 'socket.io'
import exphbs from 'express-handlebars'


const app = express()   
app.use('/static', express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: [
        'views/components/'
    ]
});

app.engine('handlebars',hbs.engine);
app.set('view engine', 'handlebars');


app.io = io.listen(app.listen(3002));

app.memoryStack = [];

module.exports = {
    app: app,
    io : app.io,
    memoryStack : app.memoryStack
}