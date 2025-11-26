const { createServer } = require("http");
const next = require("next");
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Next.js production server running on http://10.0.9.63:3000");
  });
});
