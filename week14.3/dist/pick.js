"use strict";
const displayUserProfile = (user) => {
    console.log(`Name: ${user.name}, Email: ${user.email}`);
};
// Example usage
const user = { name: 'Reddy pava', email: 'john.doe@example.com' };
displayUserProfile(user);
