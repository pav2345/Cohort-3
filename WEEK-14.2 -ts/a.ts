interface User {
    firstName:string;
    lastName:string;
   
    age:number;
}


function filteredUsers(users:User[]){
    return users.filter(x=>x.age>=18);
}

console.log(filteredUsers([{
    firstName:"pavan",
    lastName:"Reddy",
    age:21
    
},{
    firstName:"raman",
    lastName:"Reddy",
    age:16
} ,]));