"use strict";

const Benchmark = require('benchmark')
const _ = require('lodash')
const microtime = require('microtime')

let CALCULATION_COST = 5; // microseconds

class RandomValue {
    constructor(){
        this.value = Math.random();
    }
}

const sleep = () => {
    const now = microtime.now();
    while( microtime.now() < now + CALCULATION_COST ){ /* do nothing */ }
}


const toValue = (rv) => {
    sleep(); // pretend it takes awhile to calculate "value"
    return rv.value;
}


const Values = Array(1000).fill().map( ()=> new RandomValue() );

const suite = new Benchmark.Suite;

// add tests
suite.add('Array.sort', function() {
    Values.sort( (a,b) => {
        a = toValue(a); b = toValue(b);
        return a < b ? -1 : a > b ? 1 : 0;
    });
})
suite.add('_.sortBy', function() {
    _.sortBy(Values, toValue);
})
// add listeners
suite.on('cycle', function(event) {
    console.log(String(event.target));
})
suite.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
suite.run()
