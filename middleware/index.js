const express=require("express");

const app=express();
const port=3000;


function isOldEnoughMiddleware(req,res,next){
    const age=req.query.age;
    if(age>=14){
        next();
    }else{
        res.json({
            msg:"sorry you are not age yet"
        })
    }
}
app.use(isOldEnoughMiddleware);

app.get("/ride1",(req,res)=>{
    res.json({
        msg:"you have successfully riden a ride1"
    });
});

app.listen(3000);
app.get("/ride2",(req,res)=>{
    res.json({
        msg:"you have successfully riden a ride2"
    });
    
});
app.listen(3000);

