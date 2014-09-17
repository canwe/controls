var f = function(x,y) {
	console.log(x + ' ' + y);
};


f(1);

var f2 = f.bind(undefined, 2);

f2(3);


var f3 = f2.bind(undefined, 3);
f3();
