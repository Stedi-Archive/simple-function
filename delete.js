import {
  FunctionsClient,
  DeleteFunctionCommand
} from "@stedi/sdk-client-functions";

async function deleteFunction() {
  // The client gives us access to Stedi Functions.
  const functionsClient = new FunctionsClient({
    region: "us",
    apiKey: process.env.STEDI_API_KEY   // Read API key from environment variable.
  });

  // Delete the function.
  const deleteFunctionCommand = new DeleteFunctionCommand({
    functionName: "simple-function"
  });
  await functionsClient.send(deleteFunctionCommand);
}

deleteFunction();