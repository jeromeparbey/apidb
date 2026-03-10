// fonction qui construit un otp 
export const Sendotp = (length = 6)=>{
    let otp = "" ; 
    const characters = "0123456789";
    const charactersLength = characters.length;
    for(let i = 0 ; i < length ; i++){
        otp+= characters.charAt(Math.floor(Math.random() * charactersLength));
    }
 return otp;

}

    