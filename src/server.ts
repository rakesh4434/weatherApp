import * as express from 'express';
import { getEnvironmentVariables } from "./environments/env";
import * as mongoose from 'mongoose';
import bodyParser = require('body-parser');
import userRouter from './routers/userRouter';

//import { UserRouter } from "./routers/userRouter";

export class Server{
    public  app : express.Application = express();

    constructor(){
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }
    handleErrors() {
        this.app.use((error,req,res,next)=>{
            const errorStatus=req.errorStatus || 500;
            res.status(errorStatus).json({
                message:error.message || 'something went wrong.please try again',
                status_code:errorStatus
            })
        })
    }
    error404Handler() {
       this.app.use((req,res)=>{
           res.status(404).json({
               message:'not Found',
               status_code:404
           });
       })
    }
    setRoutes() {
       this.app.use('/api/user/',userRouter)
    }

    setConfigurations() {
       this.connectMongoDb();
       this.configureBodyParser();
    }

    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

connectMongoDb(){
const databaseUrl=getEnvironmentVariables().db_url;
mongoose.connect(databaseUrl,
{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('mongodb is connected');
});

    }

}