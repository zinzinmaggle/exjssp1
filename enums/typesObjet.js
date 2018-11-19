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
            }
        ],
        dataStructure: {t:'',h:'',tr:''},
        actions: {},
        commandStructure: {}
    }
}
module.exports = TypesObjet;