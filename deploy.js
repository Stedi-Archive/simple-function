import {
  FunctionsClient,
  CreateFunctionCommand,
  UpdateFunctionCommand,
  waitUntilFunctionCreateComplete, waitUntilFunctionUpdateComplete,
} from "@stedi/sdk-client-functions";
import { readFile } from "fs/promises";
import {
  BucketsClient,
  PutObjectCommand
} from "@stedi/sdk-client-buckets";
import JSZip from "jszip";

async function deploy() {
  const apiKey = process.env.STEDI_API_KEY;                       // Read API key from the environment variable we set.
  const deploymentBucket = process.env.STEDI_DEPLOYMENT_BUCKET;   // Read bucket name from the environment.

  // The buckets client allows us to upload our function to Stedi.
  const bucketsClient = new BucketsClient({
    region: "us",
    apiKey: apiKey,
  });

  // The packaged function contents.
  const zip = new JSZip();
  zip.file("index.js", await readFile("index.js", "utf8"));
  const functionZipFile = await zip.generateAsync({ type: "nodebuffer", platform: "UNIX" });

  // What we will name the function package in the bucket.
  const deploymentFileName = "simple-function.zip";
  await bucketsClient.send(new PutObjectCommand({
    bucketName: deploymentBucket,
    key: deploymentFileName,
    body: functionZipFile,
  }));

  // The client gives us access to Stedi Functions.
  const functionsClient = new FunctionsClient({
    region: "us",
    apiKey: apiKey   // Read API key from environment variable.
  });

  // If the function already exists, we need to update it. If it doesn't exist, we need to create
  // it. We'll try to create it and if that fails, we'll update it instead.
  const functionName = "simple-function";

  try {
    // Try to create the function.
    const createFunctionCommand = new CreateFunctionCommand({
      functionName: functionName,
      packageBucket: deploymentBucket,
      packageKey: deploymentFileName,
      logRetention: 1, // TODO: this is optional in the model but appears required in SC product - update SDK
    });
    const createFunctionResult = await functionsClient.send(createFunctionCommand);
    console.log("Create function result: ", createFunctionResult);

    // The waiter utility will let us know when the function deployment is done.
    await waitUntilFunctionCreateComplete(
      {
        client: functionsClient,
        maxWaitTime: 120,
      },
      {
        functionName: functionName,
      },
    );
  }
  catch (exception) {
    console.log("Function already exists, updating instead.");

    // TODO: Update once we throw a specific error for function already existing.
    if (exception.message.includes("simple-function already exists")) {
      // If CreateFunction failed because the function already exists, we will update the function instead.
      const updateFunctionCommand = new UpdateFunctionCommand({
        functionName: functionName,
        packageBucket: deploymentBucket,
        packageKey: deploymentFileName,
      });
      const updateFunctionResult = await functionsClient.send(updateFunctionCommand);
      console.log("Update function result: ", updateFunctionResult);

      await waitUntilFunctionUpdateComplete(
        {
          client: functionsClient,
          maxWaitTime: 120,
        },
        {
          functionName: functionName,
        },
      );
    }
    else {
      // Something else went wrong. Raise the exception again and let someone else handle it.
      throw exception;
    }
  }
}

deploy();
