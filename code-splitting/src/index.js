import _ from 'lodash';
import './style.scss';

function component(){
    var element = createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

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

