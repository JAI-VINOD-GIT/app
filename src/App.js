import React, { useState } from "react";
import "./App.css";

function App() {
  const [ModelOpen, setModelOpen] = useState(false);
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState("");
  const [segmentName, setSegmentName] = useState("");
  const [schemaList, setschemaList] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);

  const webhookUrl = "enter your webhook url";

  const handleSave = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("saved successfully:", data);
        setModelOpen(false);
      })
      .catch((error) => console.error("Error saving :", error));
  };

  const handleAdd = () => {
    if (newSchema && schemaList.length > 0) {
      const selectedOption = schemaList.find(
        (option) => option.value === newSchema
      );
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setschemaList(schemaList.filter((option) => option.value !== newSchema));
      setNewSchema("");
    }
  };

  const handleRemove = (index) => {
    const updatedSchemas = [...selectedSchemas];
    const removedSchema = updatedSchemas.splice(index, 1)[0];
    setSelectedSchemas(updatedSchemas);
    setschemaList([...schemaList, removedSchema]);
  };

  return (
    <div className="App">
      <button
        className="save-segment-popup-btn"
        onClick={() => setModelOpen(true)}
      >
        Save Segment
      </button>
      {ModelOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3> {"<"} Saving Segment</h3>
            <label className="segment-name">
              Enter the Name of the Segment:
              <input
                type="text"
                value={segmentName}
                placeholder="Name of the segment"
                className="segment-name-input"
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </label>
            <p className="save-your-segment">
              To save your segment, you need to add the schemas to build the
              query
            </p>

            <div className="schema-section">
              {selectedSchemas.map((schema, index) => (
                <div key={index} className="schema-item">
                  <select
                    value={schema.value}
                    className="schema-dropdown"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const selectedOption = schemaList.find(
                        (option) => option.value === newValue
                      );
                      const updatedSchemas = [...selectedSchemas];
                      updatedSchemas[index] = selectedOption;
                      setSelectedSchemas(updatedSchemas);
                      setschemaList(
                        schemaList.filter((option) => option.value !== newValue)
                      );
                    }}
                  >
                    {schemaList.concat(schema).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className="remove-schema-btn"
                    onClick={() => handleRemove(index)}
                  >
                    -
                  </button>
                </div>
              ))}
              <div className="schema-item">
                <select
                  value={newSchema}
                  className="schema-dropdown"
                  onChange={(e) => setNewSchema(e.target.value)}
                >
                  <option value="">Add schema to segment</option>
                  {schemaList.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>{" "}
                <button className="add-schema-btn" onClick={handleAdd}>
                  + Add new schema
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="save-segment-btn" onClick={handleSave}>
                Save the Segment
              </button>
              <button
                className="cancel-btn"
                onClick={() => setModelOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
