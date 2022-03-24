const https = require('https');
const readline = require('readline');
const fs = require('fs')

function extractCodePoint (point) {
  return String.fromCodePoint(parseInt(point.trim(), 16));
}

function extract(entry) {
  return entry.trim().split(/\s+/g).map(extractCodePoint).join('')
}

function logProgress (entries) {
  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(`Processing ${entries} entries...`)
}

https.get('https://unicode.org/Public/security/latest/confusables.txt', (resp) => {
  let extra = ''
  let entries = 0
  let map = {}

  function process(raw) {
    const line = raw.trim();
    if (!line || line[0] === '#') return;
    let split = line.split(';');
    let from = extract(split[0]);
    map[from] = extract(split[1]);
    logProgress(entries += 1)
  }

  resp.on('data', (chunk) => {
    let lines = (extra + chunk.toString()).split(/[\r\n]+/g);
    extra = lines.pop()
    lines.forEach(process)
  });

  resp.on('end', () => {
    process(extra)
    const path = "data/confusables.json"
    console.log(`\nWriting ${entries} entries to ${path}`)
    fs.writeFileSync(path, JSON.stringify(map, null, ' '), 'utf8')
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
