//custom middleware -> function
const notFound = (req,res,next) =>{
    const error = new Error(`Route ${req.originalUrl} không tồn tại` );
    error.status = 404;
    next(error);
};

const errorHandler = (err,req,res,next)=>{
    const statusCode = err.status ||500;
    return res.status(statusCode).json({
        success:false,
        message: err.message||'Loi server'
    });
};
module.exports={notFound,errorHandler};