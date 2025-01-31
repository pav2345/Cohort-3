const jwt=require("jsonwebtoken");
const jwtPassword="Pavan kumar";
const zod=require("zod");

const emailSchema=zod.string().email();
const passwordSchema=zod.string().min(6);

function signjwt(username,passsword){
    const usernameResponse=emailSchema.safeParse(username);
    const passwordResponse=passwordSchema.safeParse(passsword);
    if(!usernameResponse.success || !passwordResponse.success){
        return null;
    }

    const signature=jwt.sign({
        username
    },jwtPassword);
       return signature
}
const ans=signjwt("pavan@gmail.com","psahjkfshirezjhpiezh;zgri")
console.log(ans);