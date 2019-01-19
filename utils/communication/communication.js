

class Communication {
    constructor(type){
        this.type = type;
    }

   

    subscribe(){
        console.log("Running subscribe from super.")
    }

    listen(){
        throw new Error('You have to implement the method listen !');
    }

    publish(){
        throw new Error('You have to implement the method publish !');
    }
}

module.exports = Communication;