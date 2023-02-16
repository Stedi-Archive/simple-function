exports.handler = function (event) {
  if (event?.name) {  // Did the function receive an argument with a name field?
    console.info(`Hello, ${event.name}!`);
  }
  else {
    console.info("Hello, world!");
  }
}
