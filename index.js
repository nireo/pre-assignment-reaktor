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
  // remove versions
  if (depends !== []) {
    depends = depends.map(d => d.slice(0, d.indexOf("(")).trim());

    // since items don't
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
  document.getElementById("packages").style.display = "none";

  document.getElementById("go-back-button").onclick = () => {
    document.getElementById("packages").style.display = "";
  };
};

fetch("./status-data.txt")
  .then(r => r.text())
  .then(data => {
    // remove new lines for easier parsing
    const withOutNewLines = data.replace(/(\r\n|\n|\r)/gm, "");
    let arrays = withOutNewLines.split("Package: ");
    for (let i = 1; i < arrays.length; i++) {
      parseData(arrays[i]);
    }

    // change the interface
    document.getElementById(
      "counter"
    ).innerHTML = `${objects.length} packages loaded`;
    objects.forEach(item => {
      let button = document.createElement("button");
      button.innerHTML = item.name;
      button.onclick = () => {
        handleButtonOnClick();
      };
      document.getElementById("packages").appendChild(button);
    });
  });
