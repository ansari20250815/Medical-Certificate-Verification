import React from "react";
import '../Dashboard.css';


const summaryData = [
  { title: "Total Available Leaves", value: 28 },
  { title: "Total Sick Leaves", value: 8 },
  { title: "Total Casual Leaves", value: 14 },
  { title: "Total Paid Earned Leaves", value: 6 },
];

const LeaveSummary = () => (
  <div className="leave-summary">
    {summaryData.map((item, index) => (
      <div className="card" key={index}>
        <h2>{item.value}</h2>
        <p>{item.title}</p>
      </div>
    ))}
  </div>
);

export default LeaveSummary;
