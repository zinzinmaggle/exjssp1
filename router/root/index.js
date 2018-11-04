import { app } from '../../server.js'
import { RootController } from '../../controllers/root/index.js'

app.get('/', function (req, res) {
    RootController.render(res);
});

app.post('/ajouter', function (req, res) {
    RootController.ajouterAction(res,req)
});