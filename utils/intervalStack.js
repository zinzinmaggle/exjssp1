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
        intervalStack.forEach(element => {
            if(element.code === code){
                return true;
            }
        });
        return false;
    }

    push(object,code){
        let o = {};
        o['code'] = code;     
        o['interval'] = object;
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
        intervalStack.forEach((element, index) => {
            if(element.code === code){
                clearInterval(this.access(code)['interval']);
                intervalStack.splice(index, 1);
            }
        });
    }

}
let _intervalStack = new IntervalStack();
Object.freeze(_intervalStack);
module.exports =  _intervalStack;
