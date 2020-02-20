let objects = [];

const parseData = item => {
  const objectTemplate = {
    name: "",
    depends: "",
    description: ""
  };

  objectTemplate.name = item.split("Status")[0];

  let depends = item.split("Depends:")[1];
  depends = depends ? depends.split(", ") : [];
  if (depends !== []) {
    depends = depends.map(d => d.slice(0, d.indexOf("(")).trim());
    depends = depends.filter(d => !d.includes(" "));
  }

  objectTemplate.depends = depends;

  objectTemplate.description = item
    .split("Description: ")[1]
    .split("Homepage:")[0]
    .split("Original-Maintainer:")[0];

  objects = objects.concat(objectTemplate);
};

const handleButtonOnClick = item => {
  let packages = document.getElementById("packages");
  let singles = document.getElementById("single-item");
  packages.style.display = "none";
  singles.style.display = "";

  document.getElementById("go-back-button").onclick = () => {
    packages.style.display = "";
    singles.style.display = "none";
  };

  document.getElementById("title").innerHTML = item.name;
  document.getElementById("description").innerHTML = item.description;

  item.depends.forEach(depend => {
    let button = document.createElement("button");
    button.innerHTML = depend;
    button.onclick = () => {
      let package = objects.find(p => p.name === depend);
      handleButtonOnClick(package);
    };
    document.getElementById("depends").appendChild(button);
  });
};

fetch("./status-data.txt")
  .then(r => r.text())
  .then(data => {
    const withOutNewLines = data.replace(/(\r\n|\n|\r)/gm, "");
    let arrays = withOutNewLines.split("Package: ");
    for (let i = 1; i < arrays.length; i++) {
      parseData(arrays[i]);
    }

    document.getElementById(
      "counter"
    ).innerHTML = `${objects.length} packages loaded`;
    objects.forEach(item => {
      let button = document.createElement("button");
      button.innerHTML = item.name;
      button.onclick = () => {
        handleButtonOnClick(item);
      };
      document.getElementById("packages").appendChild(button);
    });
  });
