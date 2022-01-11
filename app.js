const express = require("express"),
  upload = require("express-fileupload"),
  sharp = require("sharp"),
  path = require("path"),
  app = express(),
  port = 3000;

var template = "template/v4ld.png";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

app.use(upload());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/", (req, res) => {
  if (req.files) {
    var file = req.files.file;
    var fName = file.name;

    file.mv(`./img/${fName}`, function (err) {
      if (err) {
        throw err;
      }
    });

    async function qrcoded() {
      await sleep(500);
      sharp(`img/${fName}`)
        .metadata()
        .then(function (metadata) {
          var width = metadata.width;
          var height = metadata.height;
          var wxh = width * height;
          if (wxh != 1000000) {
            //sharp(`img/${fName}`)
            sharp(`img/${fName}`)
              .resize(1000, 1000)
              .composite([{ input: template }])
              .toFile(`output/${fName}`);
          } else {
            sharp(`img/${fName}`)
              .composite([{ input: template }])
              .toFile(`output/${fName}`);
          }
        });
      await sleep(500);
      res.sendFile(path.join(__dirname + `/output/${fName}`));
    }

    qrcoded();
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
