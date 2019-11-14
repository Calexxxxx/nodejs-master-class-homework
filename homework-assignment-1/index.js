/**
 * @description Homework Assignment 1: Hello World API
 * @author Pascal Meers
 * @version 0.0.1
 */

/**
 * @description Dependencies
 */
const http = require("http"),
  url = require("url"),
  StringDecoder = require("string_decoder").StringDecoder;

/**
 * @description Port
 */
const port = 8000;

/**
 * @description Instantiate the HTTP server
 */
const httpServer = http.createServer((req, res) => serverLogic(req, res));

/**
 * @description Start the HTTP server
 */
httpServer.listen(port, () =>
  console.log(`The server is running and live at http://localhost:${port}`)
);

/**
 * @description Handles all logic for the server
 * @param req - the request
 * @param res - the response
 * @returns JSON
 */
const serverLogic = (req, res) => {
  /**
   * Get the request url and parse it
   */
  const parsedURL = url.parse(req.url, true);

  /**
   * Extract the path from the parsedURL and trim it
   */
  const pathname = parsedURL.pathname;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");

  /**
   * Get the payload from the request
   */
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  /**
   * The request data stream which decodes the data and appends it on the buffer as it is streamed in
   * @param data - the data received on the request
   */
  req.on("data", data => (buffer += decoder.write(data)));

  /**
   * End of the request which appends the last bit to the buffer, checks if the route exists create a data object thats being send to the route handler, sets the response header, statusCode and sends the payload converted in JSON format to the server
   */
  req.on("end", () => {
    /**
     * End of stream
     */
    buffer += decoder.end();

    /**
     * Check if the requested path exists and run that route else use the notFound route handler
     */
    const choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    /**
     * Construct the data object to send to the handler
     */
    const data = {
      trimmedPath: trimmedPath,
      payload: buffer
    };

    /**
     * Router the request to the handler specified in the router
     */
    choosenHandler(data, (statusCode, payload) => {
      /**
       * Use the status code called back by the handler or default
       */
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      /**
       * Use the payload called back by the handler or default back to an empty object
       */
      payload = typeof payload == "object" ? payload : {};

      /**
       * Convert the payload to a string
       */
      const payloadString = JSON.stringify(payload, null, 2);

      /**
       * Return the response
       */
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      /**
       * Log the path that was requested
       */
      console.log("status", statusCode, payloadString);
    });
  });
};

/**
 * @description Define the handlers variable and set it to an empty object
 */
let handlers = {};

/**
 * @description Create the hello route handler
 * @returns callback with statusCode 200 and a welcome message
 */
handlers.hello = (data, callback) =>
  callback(200, {
    message:
      "Welcome to the node.js master class homework assignment 1: Hello World API"
  });

/**
 * @description Create the not found route
 * @returns callback with statusCode 404
 */
handlers.notFound = (data, callback) => callback(404);

/**
 * @description Define the router
 */
const router = {
  hello: handlers.hello
};
