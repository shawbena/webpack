// import _ from 'lodash';
import Print from './print';

function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
    element.onClick = Print.bind(null, 'Hello webpack!');
    // console.log(_.join(['webpack', 'hello'], ';'))
    return element;
}

document.body.appendChild(component());