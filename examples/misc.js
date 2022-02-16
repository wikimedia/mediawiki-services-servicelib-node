'use strict';

/*
 *  MISC EXAMPLES
 */

module.exports = (router, app) => {

    /*
     *  REQUEST EXAMPLES
     */

    /**
     * GET /req/page
     */
    router.get('/req/page/:page', (req, res) => {
         // to issue an external request, use req.issueRequest
         const uri = `http://en.wikipedia.org/wiki/${req.params.page}`;
         console.log("URI", uri);
         return req.issueRequest(uri)
           .then((r) => {
               res.status(r.status);
               res.set(r.headers);
               res.end(r.body);
           });
     });

};
