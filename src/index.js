import './style.scss';

function getComponent() {
    // import 的规范并不允许控制 chunk 的名子或者其他属性，因为在 webpack 中 chunk 只是一个概念。幸运的是 webpack 允许通过注释设置一些特殊的参数，这样不至于违反规范
    return import(/* webpackChunkName: "lodash" */'lodash').then(_ => {
        var element = createElement('div');

        element.innerHTML = _.join(['Hello', 'webpack'], ' ');

        return element;
    }).catch(error => `An error occurred while loading the component, ${error}`);
}

getComponent().then(component => {
    appendChild(component);
})

function appendChild(childElement) {
    document.body.appendChild(childElement);
}
function querySelector(selector) {
    return document.querySelector(selector);
}
function createElement(str) {
    return document.createElement(str);
}

