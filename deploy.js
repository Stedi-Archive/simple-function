import {
  FunctionsClient,
  CreateFunctionCommand,
  UpdateFunctionCommand,
  ResourceConflictException
} from "@stedi/sdk-client-functions";
import { readFile } from "fs/promises";

async function deploy() {
  // The client gives us access to Stedi Functions.
  const functionsClient = new FunctionsClient({
    region: "us",
    apiKey: process.env.STEDI_API_KEY   // Read API key from environment variable.
  });

  // If the function already exists, we need to update it. If it doesn’t exist, we need to create
  // it. We’ll try to create it and if that fails, we’ll update it instead.
  const functionName = "simple-function";
  const code = await readFile("index.js", "utf8"); // Read in the code for the function as a string.
                                                   // This works because we only have a single file
                                                   // and no external libraries. (The Stedi
                                                   // Functions SDK is an external library, but we
                                                   // don’t need to include it as part of the
                                                   // function; it’s only used during deployment.)
                                                   // For deploying libraries and multiple files,
                                                   // see the tutorial at
                                                   // https://github.com/Stedi-Demos/deploy-function-using-sdk

  try {
    // Try to create the function.
    const createFunctionCommand = new CreateFunctionCommand({
      "functionName": functionName,
      "code": code                            
    });
    await functionsClient.send(createFunctionCommand);
  }
  catch (exception) {
    if (exception instanceof ResourceConflictException) {
      // If CreateFunction failed because the function already exists, update the function instead.
      const updateFunctionCommand = new UpdateFunctionCommand({
        "functionName": functionName,
        "code": code
      });
      await functionsClient.send(updateFunctionCommand);
    }
    else {
      // Something else went wrong. Raise the exception again and let someone else handle it.
      throw exception;
    }
  }
}

deploy();