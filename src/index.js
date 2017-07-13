import _ from 'lodash';
import './style.scss';
import printMe from './print.js';

function component(){
    var element = createElement('div');
    var btn = createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;
    element.appendChild(btn);

    return element;
}

appendChild(component());

function appendChild(childElement){
    document.body.appendChild(childElement);
}
function querySelector(selector){
    return document.querySelector(selector);
}
function createElement(str){
    return document.createElement(str);
}

