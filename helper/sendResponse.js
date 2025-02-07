

   export default function sendRes(res,status,msg,error,data){
                res.status(status).json({
                       msg,
                       error,
                       data
                })
   }