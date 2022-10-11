import {
  FunctionsClient,
  InvokeFunctionCommand
} from "@stedi/sdk-client-functions";

async function invoke() {
  // The client gives us access to Stedi Functions.
  const functionsClient = new FunctionsClient({
    region: "us",
    apiKey: process.env.STEDI_API_KEY   // Read API key from environment variable.
  });

  // Invoke the function.
  const requestPayload = {      // The payload is passed into the function as the event parameter of
    name: "Mrs. Longprattle"    // the handler function. It’s optional.
  };
  
  const invokeFunctionCommand = new InvokeFunctionCommand({
    functionName: "simple-function",
    requestPayload: Buffer.from(JSON.stringify(requestPayload))   // The payload must be passed as a
                                                                  // byte buffer, so we convert it.
  });
  const invokeFunctionResult = await functionsClient.send(invokeFunctionCommand);
  
  // The response payload (i.e. the return value of the function) is included as an array of bytes,
  // so we need to convert it to a string. In this example it will always display "null", because
  // the function doesn’t have a return value, but you know, just in case.
  const responsePayload = Buffer.from(invokeFunctionResult.responsePayload).toString();
  console.info(responsePayload);

  // The result includes the first couple of lines of the function log. It’s base64-encoded, so we
  // need to decode it first. In this example the log is small enough that it’s included in full.
  const invocationLogs = Buffer.from(invokeFunctionResult.invocationLogs, "base64").toString();
  console.info(invocationLogs);
}

invoke();