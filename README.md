# A simple function

A basic example of running code using [Stedi Functions](https://www.stedi.com/docs/functions).

## Prerequisites

You need to create:

- [A Stedi account](https://www.stedi.com/terminal/sign-up).
- [An API key](https://www.stedi.com/app/settings/api-keys).

You need to install:

- [Node.js](https://nodejs.org/) for running the function on your local machine.

You need to clone this repository.

```console
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

### Running the test

You can now run the test script, which will call `handler()`.

```console
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
  
2. Run the test.

   ```console
   node test.js
   ```

   The output should be:

   ```console
   Hello, Mrs. Longprattle!
   ```

## Deployment

The [deployment script](deploy.js) uses the Stedi Functions SDK to deploy the code to Stedi Functions. It will create a function called `simple-function`. If the function already exists, it will override the function.

### Installing the Stedi Functions SDK

Since the deployment script uses the Stedi Functions SDK, you’ll have to install it.

```javascript
npm install @stedi/sdk-client-functions
```

### API key

The deployment needs access to your Stedi account, so it needs to know your [API key](https://www.stedi.com/app/settings/api-keys). You have to set the API key as an environment variable.

```console
export STEDI_API_KEY=<your API key here>
```

Note that the code for your functions doesn’t need to know your API key, because it’s running inside your account already.

### Deploying the function

```console
node deploy.js
```

If you want more details about how this works, take a look at the comments in the [deployment script](deploy.js). This script only works for small functions, with a single file and no libraries. If you need to deploy a more complex function, take a look at the tutorial on [deploying a function using the SDK](https://github.com/Stedi-Demos/deploy-function-using-sdk).

## Invoking the function

### From code

[invoke.js](invoke.js) shows how to invoke the function from code using the SDK.

```console
node invoke.js
```

### From the command line

Alternatively, you can invoke the function from the command line using the Stedi CLI. First, you’ll have to install the CLI.

```console
npm install @stedi/cli --save-dev
```

You can then invoke the function.

```console
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

```console
npx stedi functions invoke-function --function-name simple-function \
  --payload '{ "name": "Mrs. Longprattle" }'
```

## Clean up

If you’re done with the demo, you should remove the function from your Stedi account.

### From code

[delete.js](delete.js) removes the function for you.

```console
node delete.js
```

### From the command line

Alternatively, you can use the CLI.

```console
npx stedi functions delete-function --function-name simple-function
```