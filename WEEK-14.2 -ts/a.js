function filteredUsers(users) {
    return users.filter(function (x) { return x.age >= 18; });
}
console.log(filteredUsers([{
        firstName: "pavan",
        lastName: "Reddy",
        age: 21
    }, {
        firstName: "raman",
        lastName: "Reddy",
        age: 16
    },]));
