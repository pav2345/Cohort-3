import express from "express";

import  { PrismaClient }  from "@prisma/client";
const app=express();
const client = new PrismaClient();

app.get("/users", async (req,res)=>{
    const users =await client.user.findMany();
    res.json({
        users
    })
})


app.get("todos/:id",async (req,res)=>{
    const id =req.params.id as unknown as number;

    const user =await client.user .findFirst({
        where:{
            id:id
        },
        select:{
            todos:true
        }
    });
    res.json({
        user
    })

})
app.listen(3000);

async function createUser(){
    await client .user.create({
        data:{
            username:"pavan",
            password:"cnlabehahf",
            age          :21,
            city  :"Delhi"
        }
    })

}

console.log("user Executed")  
  

createUser();

