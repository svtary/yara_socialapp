import jsonwebtoken from "jsonwebtoken";

import User from "../models/User";
// const createtoken=(id:any)=>{
//     const token=jsonwebtoken.sign({data:id},"yarayu",{expiresIn:"24h"});
//     return token; 
//     }

const tokenDecode = (req:any) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, "yarayu");
      // 验证 JWT 的用效性
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req:any, res:any, next:any) => {
  const tokenDecoded:any= tokenDecode(req);
  console.log("tdecode",tokenDecoded)

  if (!tokenDecoded) 
  return res.status(401).json("Unathorized");


  const user = await User.findById(tokenDecoded.data);

  if (!user) return res.status(401).json("Unathorized");

  req.user = user;

  next();
};

export default {auth} ;