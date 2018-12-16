import {memoryStack} from '../server.js'
import {find} from 'lodash';

class MemoryStack {
    static instance;
    constructor(){
        if(instance){
           return instance;        
        }
        this.instance = this;
    }

    check(code){
        for(let k in memoryStack){
           if(memoryStack[k].code === code){
               return true;
           }
        }
        return false;
    }

    push(object,code,isInterval){
        let o = {};
        o[code] = code;
        if(isInterval){
            o['interval'] = object;
        }else{
            o['ios'] = object;
        }
        if(!this.check(code)){
            memoryStack.push(o);
            return true;
        }
        o=null;
        return false;
    }

    access(code){
      return find(memoryStack, function(o) { return o.code === code});
    }

    pop(code){
        for(let k in memoryStack){
            if(memoryStack[k].code === code){
                clearInterval(this.access(code)['interval']);
                memoryStack.splice(k, 1);
            }
        }
    }
}
let instance = new MemoryStack();
Object.freeze(instance);
module.exports = {
    MemoryStack: instance
};
