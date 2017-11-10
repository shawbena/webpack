import _ from 'lodash';

function component(){
    var element = createElement('div');
    var button = createElement('button');
    var br = createElement('br');

    button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.appendChild(br);
    element.appendChild(button);

    button.onclick = e => import(/* webpackChunkName: 'print' */ './print').then(module => {
        var print = module.default;
        print();
    });

    return element;
}
var element = component();
appendChild(element);

function appendChild(childElement){
    document.body.appendChild(childElement);
}
function querySelector(selector){
    return document.querySelector(selector);
}

function createElement(str){
    return document.createElement(str);
}

