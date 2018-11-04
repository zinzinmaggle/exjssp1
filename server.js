import express from 'express'
import bodyParser from 'body-parser';
import * as io from 'socket.io'
import exphbs from 'express-handlebars'
import mqtt from 'mqtt'


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

var client  = mqtt.connect('mqtt://127.0.0.1:1883')
client.subscribe('dht11');

client.on('message', function (topic, message) {
    test(message);
    console.log("message reveived at " + new Date());
});
function test(message){
    app.io.emit('messages', "message received : "+message);
}

module.exports = {
    app
}