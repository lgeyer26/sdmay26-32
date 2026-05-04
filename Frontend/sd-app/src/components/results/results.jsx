import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./results.css";

const ResultsPopup = ({ isOpen, onClose, results }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Reset tab when new results come in
  useEffect(() => {
    setActiveTab(0);
  }, [results]);

  if (!isOpen) return null;

  if (!results || results.length === 0) {
    return (
      <div className="overlay">
        <div className="popup">
          <p>No results available</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  console.log("Results [0]:", results[0]);
  const current = results[activeTab] || results[0];

  // Build combined dataset (true + predicted)
  const chartData = (current.true_values || []).map((val, i) => ({
    time: `${i.toString().padStart(2, "0")}:00`,
    true: val,
    predicted: current.predicted_values?.[i] ?? null
  }));

  const exportToCSV = () => {
    if (!results || results.length === 0) return;

    let csv = "Dataset,Subzone,Hour,True,Predicted\n";

    results.forEach(result => {
      const trueArr = result.true_values || [];
      const predArr = result.predicted_values || [];

      trueArr.forEach((val, i) => {
        const hour = `${i.toString().padStart(2, "0")}:00`;
        const pred = predArr[i] ?? "";

        csv += `${result.dataset},${result.subzone},${hour},${val},${pred}\n`;
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "forecast_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overlay">
      <div className="popup">

        <h2>Day-ahead Power Load Forecast Results</h2>

        {/* Tabs */}
        <div className="tabs">
          {results.map((r, i) => (
            <button
              key={r.subzone || i}
              className={i === activeTab ? "tab active" : "tab"}
              onClick={() => setActiveTab(i)}
            >
              {r.subzone}
            </button>
          ))}
        </div>

        {/* Info */}
        <p><strong>Dataset:</strong> {current.dataset}</p>
        <p><strong>Subzone:</strong> {current.subzone}</p>
        <p><strong>Input Size:</strong> {current.enc_in}</p>

        <h3>True vs Predicted (Hourly)</h3>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="true"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              name="True"
            />

            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#ff7300"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>

        <button onClick={onClose}>Close</button>
        <button onClick={exportToCSV} style={{ marginLeft: "10px" }}>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default ResultsPopup;
