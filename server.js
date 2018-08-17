import express from 'express'
import * as io from 'socket.io'
import exphbs from 'express-handlebars'
import mqtt from 'mqtt'

const app = express()   
app.use('/static', express.static(__dirname + '/views'));
app.use('/public', express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.io = io.listen(app.listen(3002));

var client  = mqtt.connect('mqtt://127.0.0.1:1883')
client.subscribe('topic');

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