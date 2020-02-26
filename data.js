import { setObjects } from "./index";

let tempObjects = [];

const parseSingle = item => {
  const objectTemplate = {
    name: "",
    depends: "",
    description: ""
  };

  objectTemplate.name = item.split("Status")[0].split("Essential")[0];

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

export const parseMain = data => {
  console.log("hello");
  const withOutNewLines = data.replace(/(\r\n|\n|\r)/gm, "");
  let arrays = withOutNewLines.split("Package: ");
  for (let i = 1; i < arrays.length; i++) {
    parseSingle(arrays[i]);
  }
  setObjects(tempObjects);
};
