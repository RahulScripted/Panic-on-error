// Playground file to test the Panic on Error extension
// Uncomment lines below to trigger errors and hear the sound!

// Example 1: Type Error (uncomment to test) ← REMOVE THE // BELOW
// const num: number = "string";

// Example 2: Missing type (uncomment to test)
// function add(a, b) {
//     return a + b;
// }

// Example 3: Property doesn't exist (uncomment to test)
// interface User {
//     name: string;
// }
// const user: User = { name: "John", age: 30 };

// Working code (no errors)
interface Person {
    name: string;
    age: number;
}

function greet(person: Person): string {
    return `Hello, ${person.name}!`;
}

const user: Person = { name: "World", age: 25 };
console.log(greet(user));
