import React, { useState } from "react";

const PestAdvisory = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_KEY = "YwtOedarlUcD9NV5Hr2w9OQ8YSbSEDHqPvrMKi5W2VwEDOZK7g";

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("Please upload a crop leaf image.");
        setLoading(true);

        try {
            // Convert image to Base64
            const toBase64 = (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result.split(",")[1]);
                    reader.onerror = (error) => reject(error);
                });

            const imageBase64 = await toBase64(selectedFile);

            const payload = {
                images: [imageBase64],
            };

            const response = await fetch(
                "https://crop.kindwise.com/api/v1/identification",
                {
                    method: "POST",
                    headers: {
                        "Api-Key": API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log("Kindwise response:", data);

            const cropSuggestions = data.result.crop?.suggestions || [];
            const diseaseSuggestions = data.result.disease?.suggestions || [];

            setResult({
                crop: cropSuggestions[0]?.name || "Unknown crop",
                cropConfidence: cropSuggestions[0]?.probability || null,
                disease: diseaseSuggestions[0]?.name || "No disease detected",
                diseaseConfidence: diseaseSuggestions[0]?.probability || null,
            });
        } catch (error) {
            console.error("Error analyzing image:", error);
            alert("Failed to analyze the image. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8">
            <h1 className="text-4xl font-extrabold text-green-700 mb-6 drop-shadow">
                🌱 Pest & Disease Advisory
            </h1>

            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-green-200">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-700 border rounded-lg bg-gray-50 cursor-pointer p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                {preview && (
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={preview}
                            alt="preview"
                            className="h-52 w-full object-cover rounded-xl shadow-md border border-gray-200"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="mt-5 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-green-700 transition duration-300 ease-in-out"
                        >
                            {loading ? "🔍 Analyzing..." : "Analyze Image"}
                        </button>
                    </div>
                )}

                {result && (
                    <div className="mt-6 bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl shadow-inner border border-green-300">
                        <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center">
                            🩺 Analysis Report
                        </h2>
                        <div className="space-y-3 text-gray-800">
                            <p className="text-lg">
                                <span className="font-semibold text-green-800">🌾 Crop Detected:</span>{" "}
                                {result.crop}{" "}
                            </p>
                            <p className="text-lg">
                                <span className="font-semibold text-red-700">🦠 Disease / Pest:</span>{" "}
                                {result.disease}{" "}
                                {result.diseaseConfidence && (
                                    <span className="text-sm text-gray-600">
                                        ({(result.diseaseConfidence * 100).toFixed(1)}% confidence)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={() => setResult(null)}
                                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
                            >
                                Clear Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PestAdvisory;
