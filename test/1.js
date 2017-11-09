var name = 'world';

a();
function a() {
    console.log(name);
    if (typeof name === 'undefined') {
        var name = 'jack';
        console.log("Goodbye " + name)
    } 
    //else {
    //     console.log("Hello" + name);
    // }
}

console.log(name);