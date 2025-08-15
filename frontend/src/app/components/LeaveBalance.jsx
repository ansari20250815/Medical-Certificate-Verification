import React from "react";
import '../Dashboard.css';


const leaveData = [
  {
    type: "Paternity Leave",
    from: "18/09/2016",
    to: "15/08/2017",
    days: 2,
    reason: "Marriage Leave",
    approvedBy: "Ralph Edwards",
    status: "Approved",
  },
  {
    type: "Sick Leave",
    from: "15/08/2017",
    to: "15/08/2017",
    days: 4,
    reason: "Compensation Leave",
    approvedBy: "Eleanor Pena",
    status: "Approved",
  },
  {
    type: "Annual Leave",
    from: "16/08/2013",
    to: "16/08/2013",
    days: 4,
    reason: "Jury Service Leave",
    approvedBy: "Dianne Russell",
    status: "Rejected",
  },
  // Add more rows...
];

const LeaveTable = () => (
  <div className="leave-table">
    <div className="table-header">
      <h3>All Leaves Requests</h3>
      <button className="apply-btn">+ Apply Leave</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Leave Type</th>
          <th>From</th>
          <th>To</th>
          <th>Days</th>
          <th>Reason</th>
          <th>Approved By</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {leaveData.map((leave, index) => (
          <tr key={index}>
            <td>{leave.type}</td>
            <td>{leave.from}</td>
            <td>{leave.to}</td>
            <td>{leave.days}</td>
            <td>{leave.reason}</td>
            <td>{leave.approvedBy}</td>
            <td>
              <span className={`status-tag ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </td>
            <td>
              <button className="action-btn">✏️</button>
              <button className="action-btn">🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeaveTable;
