/**
 * Define and configure status monitor
 * 
 * @author Vamsi K Palle <pvamsi170@gmail.com>
 */

import { Application } from "express";
import expressStatusMonitor from 'express-status-monitor';

import Log from './Log';
import Locals from '../providers/Locals';

class StatusMonitor {
    public mount (_express: Application): Application {
        Log.info('Booting the \'StatusMonitor\' middleware...');

        // Define Status monitor config
        const monitorOptions: object = {
            path: '/status-monitor',
            spans: [
                {
                    interval: 1,    // Every one second
                    retention: 60   // Keep 60 data-points in memory
                },
                {
                    interval: 5,
                    retention: 60
                },
                {
                    interval: 15,
                    retention: 60
                }
            ],
            chartVisibility: {
                mem: true,
                rps: true,
                cpu: true,
                load: true,
                statusCodes: true,
                responseTime: true
            },
            healthChecks: [
                {
                    protocol: 'http',
                    host: 'localhost',
                    path: '/',
                    port: '8080'
                },
                {
                    protocol: 'http',
                    host: 'localhost',
                    path: `/${api}`,
                    port: '8080'
                }
            ]
        };

        // Loads the express status monitor middleware
        _express.use(expressStatusMonitor(monitorOptions));

        return _express;
    }
}

export default new StatusMonitor;