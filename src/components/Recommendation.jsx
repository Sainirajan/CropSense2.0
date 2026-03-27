import React, { useState } from "react";

export default function Recommendation() {
  const [activeForm, setActiveForm] = useState(""); // "crop" or "fertilizer"
  const [cropForm, setCropForm] = useState({
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Temperature: "",
    Humidity: "",
    Ph: "",
    Rainfall: "",
  });
  const [fertForm, setFertForm] = useState({
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Crop: "",
  });
  const [cropResult, setCropResult] = useState(null);
  const [fertResult, setFertResult] = useState(null);

  const handleCropChange = (e) => {
    setCropForm({ ...cropForm, [e.target.name]: e.target.value });
  };

  const handleFertChange = (e) => {
    setFertForm({ ...fertForm, [e.target.name]: e.target.value });
  };

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cropForm),
      });
      const data = await res.json();
      setCropResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFertSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/predict_fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fertForm),
      });
      const data = await res.json();
      setFertResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Smart Recommendations
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => {
            setActiveForm("crop");
            setFertResult(null);
          }}
          className={`px-6 py-3 rounded-xl shadow-md text-white font-medium transition ${activeForm === "crop"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          Crop Recommendation
        </button>
        <button
          onClick={() => {
            setActiveForm("fertilizer");
            setCropResult(null);
          }}
          className={`px-6 py-3 rounded-xl shadow-md text-white font-medium transition ${activeForm === "fertilizer"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          Fertilizer Recommendation
        </button>
      </div>

      {/* Crop Recommendation Form */}
      {activeForm === "crop" && (
        <form
          onSubmit={handleCropSubmit}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Enter Soil & Weather Details
          </h2>
          {Object.keys(cropForm).map((key) => (
            <div key={key}>
              <label className="block text-gray-700 capitalize mb-1">
                {key}
              </label>
              <input
                type="number"
                step="any"
                name={key}
                value={cropForm[key]}
                onChange={handleCropChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Get Crop Recommendation
          </button>
        </form>
      )}

      {/* Fertilizer Recommendation Form */}
      {activeForm === "fertilizer" && (
        <form
          onSubmit={handleFertSubmit}
          className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Enter Soil Nutrients & Crop
          </h2>
          {["Nitrogen", "Phosphorus", "Potassium"].map((key) => (
            <div key={key}>
              <label className="block text-gray-700 mb-1">{key}</label>
              <input
                type="number"
                step="any"
                name={key}
                value={fertForm[key]}
                onChange={handleFertChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-700 mb-1">Crop</label>
            <input
              type="text"
              name="Crop"
              value={fertForm.Crop}
              onChange={handleFertChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Get Fertilizer Recommendation
          </button>
        </form>
      )}

      {/* Crop Results */}
      {cropResult && (
        <div className="max-w-4xl mx-auto mt-10 grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center"
            >
              <img
                src={`${cropResult[`resultImage${i}`]}`}
                alt={cropResult[`result${i}`]}
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold text-green-700">
                {cropResult[`result${i}`]}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {cropResult[`description${i}`]}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Fertilizer Result */}
      {fertResult && (
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
          <img
            src={`${fertResult.imagef}`}
            alt={fertResult.result}
            className="w-32 h-32 object-cover rounded-lg mb-3"
          />
          <h3 className="text-xl font-bold text-green-700 mb-3">
            {fertResult.result}
          </h3>
          <p className="text-gray-600">{fertResult.description}</p>
        </div>
      )}
    </div>
  );
}
