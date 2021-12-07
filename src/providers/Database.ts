/**
 * Define database connection
 * 
 * @author Vamsi K Palle <pvamsi170@gmail.com>
 */

import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { MongoError } from 'mongodb';

import Locals from './Locals';
import Log from '../middleware/Log';

export class Database {
    // Initialize your database pool
    public static init (): any {
        const databaseurl = Locals.config().mongooseUrl;
        const options = { useNewUrlParser: true, useUnifiedTopology: true};

        (<any>mongoose).Promise = bluebird;

        mongoose.set('useCreateIndex', true);

        mongoose.connect(databaseurl, options, (error: MongoError ) => {
            if(error) {
                Log.info('Failed to connect to Mongo Server!');
                console.log(error);
                throw error;
            } else {
                Log.info('Connected to mongo server at: ' + databaseurl);
            }
        });
    }
}

export default mongoose;
