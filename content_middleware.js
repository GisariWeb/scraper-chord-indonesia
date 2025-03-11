export default function contentMiddleware(options) {

}

export function listEndpoints(app) {
    const endpoints = [];

    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            // Routes registered directly on the app
            endpoints.push({
                method: Object.keys(middleware.route.methods)[0].toUpperCase(),
                path: middleware.route.path,
            });
        } else if (middleware.handle.stack) {
            // Routes registered on a router (like v1)
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    endpoints.push({
                        method: Object.keys(handler.route.methods)[0].toUpperCase(),
                        path: middleware.regexp.source.replace('\\/?', '/') + handler.route.path
                    });
                }
            });
        }
    });

    return endpoints;
}