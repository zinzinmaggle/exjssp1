import Objet from '../../models/objet.js';
const { body,check } = require('express-validator/check');

const _root_validator_ajouter_action = [
    body('mqttId').custom(value => {
        return Objet.find({mqttId : value}).then(objet => {
          if (Array.isArray(objet) && objet.length) {
            return Promise.reject('Un objet avec le même identifiant de connexion est déjà en cours d\'utilisation.');
          }
        });
      }),
    check('libelle').isLength({ min: 5, max: 15 }).withMessage('La longueur du libellé doit être comprise entre 5 et 15 caractères.'),
    check('mqttId').matches(/^[A-Z]{3}-[A-Z]{3}$/).withMessage('L\'identifiant de connexion doit être au format XXX-XXX.'),
    body('typeObjetCd').exists({checkFalsy: true}).withMessage('Veuillez sélectionner un type d\'objet.')
];

module.exports = _root_validator_ajouter_action;