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
let element = component();
appendChild(element);

if(module.hot){ //?
    module.hot.accept('./print.js', function(){
        console.log('Accepting the update printMe module!');
        element.remove();
        element = component(); //re-render the "component" to update the click handler
        appendChild(element);
    });
}

function appendChild(childElement){
    document.body.appendChild(childElement);
}
function querySelector(selector){
    return document.querySelector(selector);
}
function createElement(str){
    return document.createElement(str);
}

