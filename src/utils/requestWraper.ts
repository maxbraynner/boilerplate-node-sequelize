/**
 * wrap a controller call with error handler
 * @param controller controller method to call
 */
export const wraper = (controller: Function) => (req, res, next) => {
    controller(req, res).catch(next);
};
