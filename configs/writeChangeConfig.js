const fs = require("fs");
const { debug } = require("../debug");

function saveConfig(jsonContent) {
  if (typeof jsonContent !== "string") {
    debug("jsonContent param is not a string", "red");
    return;
  }

  fs.writeFile("./configs/settings.json", jsonContent, "utf-8", function (err) {
    if (err) debug("error saving settings.json", "red");
  });

  debug(`settings.json saved: ${jsonContent}`, "blue");
}

module.exports = { saveConfig };
