function component(){
	var element = document.createElement('div');
	//locash
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');

	return element;
}

document.body.appendChild(component());
