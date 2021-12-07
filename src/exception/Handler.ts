/**
 * Define error and exception handlers
 * 
 * @author Vamsi K Palle <pvamsi170@gmail.com>
 */

import Log from '../middleware/Log';
import Locals from '../providers/Locals';

class Handler {
    /**
     * To handle all the not found routes
     */
    public static notFoundHandler(_express): any {
        const apiPrefix = Locals.config().apiPrefix;

        _express.use('*', (req, res) => {
            const ip = req.handlers['x-forwarded-for'] || req.connection.remoteAddress;

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
            if(req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
                return res.json({
                    error: 'Page Not Found'
                });
            } else {
                res.status(404);
                return res.render('pages/error', {
                    title: 'Page Not Found',
                    error: []
                });
            }
        });
        return _express;
    }

    /**
     * Handler all api/web routes errors/exception
     */
    public static clientErrorHandler(err, req, res, next): any {
        Log.error(err.stack);

        if(req.xhr) {
            return res.status(500).send({error: 'Something went wrong!'});
        } else {
            return next(err);
        }
    }

    /**
     * Show page under maintenance incase of few specific errors
     */
    public static errorHandler(err, req, res, next): any {
        Log.error(err.stack);
        res.status(500);

        const apiPrefix = Locals.config().apiPrefix;
        if(req.originalUrl.includes(`/${apiPrefix}/`)) {
            if(err.name && err.name === 'UnauthorizedError') {
                const innerMessage = err.inner && err.inner.message ? err.inner.message : undefined;
                return res.json({
                    error: [
                        'Invalid Token!',
                        innerMessage
                    ]
                });
            }
            return res.json({
                error: err
            });
        }

        return res.render('pages/error', { error: err.stack, title: 'Under Maintenance' });
    }

    /**
     * Register your error/exception monitoring tools right here i.e before "next(err)"!
     */

    public static logErrors(err, req, res, next): any {
        Log.error(err.stack);

        return next(err);
    }
}

export default Handler;