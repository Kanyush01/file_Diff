import React from "react";
import { useState } from "react";

export default function Compare() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [differences, setDifferences] = useState([]);

  const handleFileChange = (e, setJson) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          setJson(json);
        } catch (error) {
          alert("Invalid JSON format in file");
        }
      };
      reader.readAsText(file);
    }
  };

  const compareJSON = (obj1, obj2, path = "") => {
    const diffrence = [];

    for (const key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        diffrence.push({
          type: "removed",
          path: path ? `${path}.${key}` : key,
          value: obj1[key],
        });
      } else if (
        typeof obj1[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        diffrence.push(
          ...compareJSON(obj1[key], obj2[key], path ? `${path}.${key}` : key)
        );
      } else if (obj1[key] !== obj2[key]) {
        diffrence.push({
          type: "changed",
          path: path ? `${path}.${key}` : key,
          oldValue: obj1[key],
          newValue: obj2[key],
        });
      }
    }

    for (const key in obj2) {
      if (!obj1.hasOwnProperty(key)) {
        diffrence.push({
          type: "added",
          path: path ? `${path}.${key}` : key,
          value: obj2[key],
        });
      }
    }

    return diffrence;
  };

  const handleCompare = () => {
    if (file1 && file2) {
      const diff = compareJSON(file1, file2);
      setDifferences(diff);
    } else {
      alert("Please upload both JSON files");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".json"
        onChange={(e) => handleFileChange(e, setFile1)}
      />
      <input
        type="file"
        accept=".json"
        onChange={(e) => handleFileChange(e, setFile2)}
      />
      <button onClick={handleCompare}>Compare</button>
      {differences.length > 0 ? (
        <div>
          <h2>Differences:</h2>
          <ul>
            {differences.map((diff, index) => (
              <li key={index}>
                {diff.type.toUpperCase()} at {diff.path}:{" "}
                {diff.oldValue !== undefined
                  ? `old value: ${diff.oldValue}, new value: ${diff.newValue}`
                  : `value: ${diff.value}`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>There is no Difference between Files</h2>
        </div>
      )}
    </div>
  );
}
