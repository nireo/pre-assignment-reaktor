let objects = [];
let selectedItem = null;

const parseData = item => {
  const objectTemplate = {
    name: '',
    depends: '',
    description: ''
  };

  objectTemplate.name = item
    .split('Status')[0]
    .split('Essential')[0]
    .trim();

  let depends = item.split('Depends:')[1];
  depends = depends ? depends.split('Description:')[0] : '';
  depends = depends ? depends.split(', ') : [];
  if (depends.length > 0 && typeof depends === 'object') {
    depends = depends.map(d => d.slice(0, d.indexOf('(')).trim());
    depends = depends
      .filter(d => !d.includes(' '))
      .filter(d => !d.includes('|'));
  }

  objectTemplate.depends = depends;
  objectTemplate.description = item
    .split('Description: ')[1]
    .split('Homepage:')[0]
    .split('Original-Maintainer:')[0];

  objects = objects.concat(objectTemplate);
};

const checkSelectedItem = () => {
  let packages = document.getElementById('packages');
  packages.style.display = 'none';
  if (selectedItem === null) {
    // if no item is selected, display them all
    packages.style.display = '';
    return;
  }

  let single = document.getElementById('single-item');

  document.getElementById('go-back-button').onclick = () => {
    selectedItem = null;
    single.style.display = 'none';
    checkSelectedItem();
  };

  document.getElementById('go-back-button').className = 'button';
  single.style.display = '';

  document.getElementById('title').innerHTML = selectedItem.name;
  document.getElementById('description').innerHTML = selectedItem.description;

  // clear the old dependency field
  document.getElementById('depends').innerHTML = '';
  selectedItem.depends.forEach(depend => {
    let button = document.createElement('button');
    button.className += 'button';
    button.innerHTML = depend;
    button.onclick = () => {
      selectedItem = objects.find(i => i.name === depend);
      checkSelectedItem();
    };

    document.getElementById('depends').appendChild(button);
  });
};

fetch('./status-data.txt')
  .then(r => r.text())
  .then(data => {
    const withOutNewLines = data.replace(/(\r\n|\n|\r)/gm, '');
    let arrays = withOutNewLines.split('Package: ');
    for (let i = 1; i < arrays.length; i++) {
      parseData(arrays[i]);
    }

    document.getElementById(
      'counter'
    ).innerHTML = `${objects.length} packages loaded`;
    objects.forEach(item => {
      let button = document.createElement('button');
      button.className += 'button';
      button.innerHTML = item.name;
      button.onclick = () => {
        selectedItem = item;
        checkSelectedItem();
      };
      document.getElementById('packages').appendChild(button);
    });
  });
