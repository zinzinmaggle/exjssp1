const Badges = {
    WARNING : {
        BROKER_OFFLINE : {
            badge : "{\"badge\":\"WARNING\", \"message\":\"L\'application ne parvient pas à se connecter au broker MQTT\"}"
        },
        ERRONEOUS_DATA : {
            badge : "{\"badge\":\"WARNING\", \"message\":\"Les données fournies par l\'objet sont éronnées.\"}"
        } 
    },
    OFFLINE : {
       DEVICE_OFFLINE : {
           badge : "{\"badge\":\"OFFLINE\", \"message\":\"Vérifier que l\'objet est allumé ou qu'il dispose d\'une connexion internet. Il peut s\'agir d\'une panne matériel.\"}"
       }
    },
    ONLINE : {
        DEVICE_ONLINE : {
            badge : "{\"badge\":\"ONLINE\", \"message\":\"Transmission des données...\"}"
        }
    }
};


Object.freeze(Badges);
module.exports = Badges;