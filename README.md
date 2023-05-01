# A simple function

A basic example of running code using [Stedi Functions](https://www.stedi.com/docs/functions).

## Prerequisites

You need to create:

- [A Stedi account](https://www.stedi.com/terminal/sign-up).
- [An API key](https://www.stedi.com/app/settings/api-keys).
- [A deployment bucket](https://www.stedi.com/app/buckets/createBucket).

You need to install:

- [Node.js](https://nodejs.org/) for running the function on your local machine.

You need to clone this repository.

```shell
git clone https://github.com/Stedi-Demos/simple-function.git
cd simple-function
```

## A look at the code

You can see the code for the simple function in [index.js](index.js). A couple of notes:

- The code exports a function called `handler()`.
- `handler()` is called automatically by Stedi Functions when you invoke the function.
- The function has a parameter `event`. Through this parameter you can send data into the function. 
- `console.info()` writes a string to the log.

The other files are helper scripts. We’ll cover each when we need them, but if you’re curious, here’s an overview of all the files.

| File      | Description                                                    |
|-----------|----------------------------------------------------------------|
| index.js  | The code we will upload to Stedi Functions.                    |
| test.js   | A script that allows you to test the function locally.         |
| deploy.js | A script that deploys the code in index.js to Stedi Functions. |
| invoke.js | A script that invokes the function after it’s been deployed.   |
| delete.js | A script that deletes the function from Stedi Functions.       |

## Testing locally

Before you deploy the function to your Stedi account, you may want to test it on your local machine. In order to do this, you need to call `handler()`, but you shouldn’t do this in `index.js`, because once deployed, Stedi Functions will call `handler()` for you. Instead, there’s a [test file](test.js) which calls `handler()`.

### Preparation

`test.js` uses [ECMAScript Modules](https://webpack.js.org/guides/ecma-script-modules/), so you need to let Node.js know about that before you can run the code.

1. [Optional] Initialize npm.

You do NOT need to initialize npm - we have provided a basic `package.json` file to get you started. This step would be required if you were starting a brand new Stedi Functions project from scratch so we have included it here for completeness.

```shell
npm init es6 -y
```

The `es6` parameter tells npm to treat this project as an ECMAScript module, which allows us to reference the Stedi SDK using the ES import statement. Alternatively, we would need to ensure that `package.json` contains the entry `"type": "module"`.

The option `-y` fills `package.json` with default values. If you leave it out, npm will ask you for a couple of values before creating `package.json`, but you can also edit those after `package.json` has been created.

### Running the test

You can now run the test script, which will call `handler()`.

```shell
node test.js
```

The output should be:

```
Hello, world!
```

### Passing a parameter

If you want to pass a parameter to `handler()`, you’ll have to change the code in [test.js](test.js).

1. Change the code that calls the function.

```javascript
handler({
  name: "Mrs. Longprattle"
});
```

2. Run the test.

```shell
node test.js
```

The output should be:

```shell
Hello, Mrs. Longprattle!
```

## Deployment

The [deployment script](deploy.js) uses the Stedi Functions SDK to deploy the code to Stedi Functions. It will create a function called `simple-function`. If a function named `simple-function` already exists in the Stedi account, it will override the existing definition.

### Installing the Stedi Functions SDK

Since the deployment script uses the Stedi Functions SDK, you’ll have to install it. This example is designed to work with Stedi Functions versions `0.2.x` or later so we'll tell `npm` to download an SDK in that range.

```shell
npm install @stedi/sdk-client-functions@^0.2 --save-dev
```
The option `--save-dev` lets npm know that the function itself does not use the SDK; we only need it for deployment.

We also need the Buckets SDK in order to publish our code to Stedi.

```shell
npm install @stedi/sdk-client-buckets@^0.2 --save-dev
```
Finally, we'll also need to install a utility library to help us package the function code into a ZIP file before we upload it.

```shell
npm install jszip@3 --save-dev
```

### API key

The deployment needs access to your Stedi account, so it needs to know your [API key](https://www.stedi.com/app/settings/api-keys). You have to set the API key as an environment variable.

```shell
export STEDI_API_KEY=<your API key here>
```

We will also need to let the deployment script know which bucket to use for the function code. You can set the bucket name as an environment variable.

```shell
export STEDI_DEPLOYMENT_BUCKET=<your bucket name here>
```

Note that the code for your functions does not need to know your API key, because it’s running inside your account already.

### Deploying the function

```shell
node deploy.js
```

If you want more details about how this works, take a look at the comments in the [deployment script](deploy.js). This script only works for small functions, with a single file and no libraries. If you need to deploy a more complex function, take a look at the tutorial on [deploying a function using the SDK](https://github.com/Stedi-Demos/deploy-function-using-sdk).

## Invoking the function

### From code

[invoke.js](invoke.js) shows how to invoke the function from code using the SDK.

```shell
node invoke.js
```

### From the command line

Alternatively, you can invoke the function from the command line using the Stedi CLI. First, you’ll have to install the CLI.

```shell
npm install @stedi/cli@2.x --save-dev
```

You can then invoke the function.

```shell
npx stedi functions invoke-function --function-name simple-function
```

The output will look something like the following.

```json
{
  "functionName": "simple-function",
  "functionInvocationId": "c15e1e99-4e10-4314-bcb7-8d45ff768b3e",
  "responsePayload": null,
  "invocationLogs": [
    "START RequestId: c15e1e99-4e10-4314-bcb7-8d45ff768b3e Version: $LATEST",
    "2022-10-11T14:50:50.453Z\tc15e1e99-4e10-4314-bcb7-8d45ff768b3e\tINFO\tHello, world!",
    "END RequestId: c15e1e99-4e10-4314-bcb7-8d45ff768b3e",
    "REPORT RequestId: c15e1e99-4e10-4314-bcb7-8d45ff768b3e\tDuration: 1.25 ms\tBilled Duration: 2 ms\tMemory Size: 1024 MB\tMax Memory Used: 56 MB\t",
    ""
  ]
}
```

It’s possible to pass in data, if a bit cumbersome.

```shell
npx stedi functions invoke-function --function-name simple-function \
  --payload '{ "name": "Mrs. Longprattle" }'
```

## Clean up

If you’re done with the demo, you should remove the function from your Stedi account.

### From code

[delete.js](delete.js) removes the function for you.

```shell
node delete.js
```

### From the command line

Alternatively, you can use the CLI.

```shell
npx stedi functions delete-function --function-name simple-function
```
