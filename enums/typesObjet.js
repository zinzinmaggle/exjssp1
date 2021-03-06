const TypesObjet = {
    TEMPERATURE_HYGROMETRIE:{
        code: "TH",
        libelle: "Sonde de température et d'hygrométrie",
        details:[
            {
                unity : "°C",
                icon: "",
                libelle : "Température",
                abreviation : "t"
            },
            {
                unity : "%",
                icon: "",
                libelle : "Hygrométrie",
                abreviation : "h"
            },
            {
                unity : "°C",
                icon: "",
                libelle : "Température ressentie",
                abreviation : "tr"
            },
        ],
        commands: [
            {
                libelle: "Arrêter",
                command : "1011100000",
                executeOnKeyPress: false,
                disableAfterPress : true
            }
        ]
    }
}
Object.freeze(TypesObjet);
module.exports = TypesObjet;