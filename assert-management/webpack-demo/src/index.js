// import _ from 'lodash';
import './style.scss';
import './info.scss';
import infoHtml from './html/info.html';
import FloatingLogo from './images/floating-logo.png';
import Data from './data.xml';

function component(){
    var element = createElement('div');
    
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = 'Hello webpack';
    element.classList.add('hello');

    //add the image to our existing div
    var myIcon = new Image();
    myIcon.src = FloatingLogo;
    element.appendChild(myIcon);

    querySelector('#page').innerHTML = infoHtml;

    console.log(Data, JSON.stringify(Data));
    return element;
}

function querySelector(selector){
    return document.querySelector(selector);
}
function createElement(str){
    return document.createElement(str);
}

document.body.appendChild(component());