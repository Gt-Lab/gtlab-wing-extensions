
// import MyInterface from './MyInterface'
import {MyInterface} from './MyInterface'

export default class MyClass implements MyInterface{
    myvar: number;
	print() {
        alert('implements test');
    }	
}