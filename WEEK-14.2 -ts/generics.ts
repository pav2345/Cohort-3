function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("Pavan kumar Reddy");
let output2 = identity<number>(100);


console.log(output1);
console.log(output2);