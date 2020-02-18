const fs = require('fs');
const data = fs.readFileSync('/var/lib/dpkg/status', 'utf8');

const parseData = item => {
  const objectTemplate = {
    name: '',
    depends: '',
    description: ''
  };

  objectTemplate.name = item.split('Status')[0];

  let depends = item.split('Depends:')[1];
  depends = depends ? depends.split(', ') : [];
  // remove versions
  if (depends !== []) {
    depends = depends.map(d => d.slice(0, d.indexOf('(')).trim());
    depends = depends.filter(d => !d.includes(' '));
  }

  objectTemplate.depends = depends;

  objectTemplate.description = item
    .split('Description: ')[1]
    .split('Homepage:')[0]
    .split('Original-Maintainer:')[0];
};

// remove new lines for easier parsing
const withOutNewLines = data.replace(/(\r\n|\n|\r)/gm, '');
let arrays = withOutNewLines.split('Package: ');
for (let i = 1; i < 51; i++) {
  parseData(arrays[i]);
}
