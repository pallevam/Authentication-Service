/**
 * Primary file for your Clustered API Server
 * 
 * @author Vamsi K Palle <pvamsi170@gmail.com>
 */

import express from 'express';

import Locals from './Locals';
import Routes from './Routes';
import Bootstrap from '../middleware/Kernel';
import ExceptionHandler from '../exception/Handler';

class Express {
    /**
     * Create the express object
     */
    public express: express.Application;

    /**
     * Initialized the express server
     */
    constructor() {
        this.express = express();

        this.mountDotEnv();
        this.mountMiddlewares();
        this.mountRoutes();
    }

    /**
     * Mounts all the defined middlewares
     */
    private mountMiddlewares (): void {
        this.express = Bootstrap.init(this.express);
    }

    private mountDotEnv (): void {
        this.express = Locals.init(this.express);
    }
    
    /**
     * Mounts all the defined routes
     */
    private mountRoutes (): void {
        this.express = Routes.mountWeb(this.express);
        this.express = Routes.mountApi(this.express);
    }

    /**
     * Starts the express server
     */
    public init(): any {
        const port: number = Locals.config().port;

        // Registering Exception/Error handlers
        this.express.use(ExceptionHandler.logErrors);
        this.express.use(ExceptionHandler.clientErrorHandler);
        this.express.use(ExceptionHandler.errorHandler);
        this.express = ExceptionHandler.notFoundHandler(this.express);

        // Start the server on the specified port
        this.express.listen(port, (_error: any) => {
            if(_error) {
                return console.log('Error: ', _error);
            }
            return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        });
    }
}

export default new Express();