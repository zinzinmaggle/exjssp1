import {intervalStack} from '../server.js'
import {find} from 'lodash';

let instance = null;

class IntervalStack {
    constructor(){
        if(instance){
           return instance;        
        }
        instance = this;
    }

    check(code){
        for(let k in intervalStack){
           if(intervalStack[k].code === code){
               return true;
           }
        }
        return false;
    }

    push(object,code){
        let o = {};
        o['code'] = code;
        if(isInterval){
            o['interval'] = object;
        }
        if(!this.check(code)){
            intervalStack.push(o);
            return true;
        }
        o=null;
        return false;
    }

    access(code){
      return find(intervalStack, function(o) { return o.code === code});
    }

    pop(code){
        for(let k in intervalStack){
            if(intervalStack[k].code === code){
                clearInterval(this.access(code)['interval']);
                intervalStack.splice(k, 1);
            }
        }
    }

}
let _intervalStack = new IntervalStack();
Object.freeze(_intervalStack);
module.exports =  _intervalStack;
