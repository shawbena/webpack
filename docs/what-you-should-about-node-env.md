# What You Should Know About NODE_ENV

Node.js programmers often check the NODE_ENV environment variable, but did you know the value actually set for the it can have additional implications? Read on to find out what they are.

NODE_ENV is an environment variable popularized by the Express framework. It specifies the environment in which an application is running such as development, staging, production, testing, etc.

By default, our application will run in development environment. And we can change the environment by changing process.env.NODE_ENV. Let’s see how frameworks and libraries will behave in different environments.

## Development

- More logs come out
- No views are cached
- More verbose error messages are generated
- Front end stuff like javascript, css, etc. aren’t minized and cached

## Production

Below are common, regardless of frameworks:

- Middleware and other dependencies switch to use efficient code path
- Only packages in dependencies are installed. Dependencies in devDependencies and peerDependencies are ignored.

- express.js
    * View templates are cached
    * Less verbose messages are generated
    * CSS files are cached

- sailsjs
    * CSRF is enabled
    * Response may be compressed (see https://www.npmjs.com/package/compression)

    * Models’ migration settings are forced to migrate: ‘safe’. This is a failsafe to protect against inadvertently damaging our production data during deployment

    * Error messages and stack traces from res.serverError() will still be logged, but will not be sent in the response

- mongoose

    * Disable autoIndex globally. Doing this will boost a significant performance( see http://docs.mongodb.org/manual/core/indexes/#index-creation-operations)

There’re more that I don’t list here. As you can see, setting NODE_ENV to production gives the best performance. As this variable is so important and has become globally adopted in Node.js world, you should burn this “always setting NODE_ENV to production” into your mind.