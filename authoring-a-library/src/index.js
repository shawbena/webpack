import _ from 'lodash';
import numRef from './ref.json';
// let numRef = require('./ref.json');

export function numToWord(num){
    return _.reduce(numRef, (accum, ref) => {
        return ref.num === num ? ref.word : accum;
    }, '');
}

export function wordToNum(word){
    return _.reduce(numRef, (accum, ref) => {
        return ref.word === word && word.toLowerCase() ? ref.num  : accum;
    }, -1);
}

export default function HelloWorld(){
    // console.log("Hello World!");
    console.log(numRef);
}