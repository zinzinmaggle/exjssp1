import { app } from '../../server.js'

app.get('/', function (req, res) {
    res.render('root/root');
});


