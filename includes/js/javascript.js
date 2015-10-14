
// Prototype
var Person = function(){
    this.can_talk = true;
};

Person.prototype.greet = function(){
    if(this.can_talk){
        console.log('Hello, I am ' + this.name);
    }
};

var Employee = function(name, title){
    Person.call(this); // initializing Person attribute in the Employee instance
    this.name = name;
    this.title = title;
};

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
// WITH Employee.prototype.constructor = Employee; prototypes of BASE CLASS will be invoked
// WITHOUT Employee.prototype.constructor = Employee; prototypes of PARENT CLASS will be invoked

Employee.prototype.greet = function() {
    if (this.can_talk) {
        console.log('Hi, I am ' + this.name + ', the ' + this.title);
    }
};

var shimon = new Employee('Shimon', 'Developer');

//shimon.greet();

// THIS
var Person = function(firstName, lastName){
    this.firstName = firstName;
    this.lastName = lastName;
    this.showFullName = function () {
        console.log (this.firstName + " " + this.lastName);
    }
};

var p = new Person('Shimon', 'Swisa');
var p2 = new Person('penelope', 'session');
p.showFullName();
p2.showFullName();

var person = {
    firstName   :"Penelope",
    lastName    :"Barrymore",
    showFullName:function () {
        console.log (this.firstName + " " + this.lastName);
    }
};

person.showFullName(); // Penelope Barrymore​

var anotherPerson = {
    firstName   :"Rohit",
    lastName    :"Khan"
};

person.showFullName.apply(anotherPerson); // Rohit Khan​


console.log('');
console.log('');
console.log('');
console.log('');
