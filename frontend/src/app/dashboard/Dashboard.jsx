import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import '../Dashboard.css';

const summaryData = [
  { label: "Total Available Leaves", value: 28, color: "bg-green-100", text: "text-green-700" },
  { label: "Total Sick Leaves", value: 8, color: "bg-blue-100", text: "text-blue-700" },
  { label: "Total Casual Leaves", value: 14, color: "bg-purple-100", text: "text-purple-700" },
  { label: "Total Paid Earned Leaves", value: 6, color: "bg-orange-100", text: "text-orange-700" },
];

const Dashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "";
    }
  };

  useEffect(() => {
    // Fetch leaves for the logged-in user
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/leave/my-leaves", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        const data = await res.json();
        setLeaves(data);
      } catch (err) {
        setLeaves([]);
      }
      setLoading(false);
    };
    fetchLeaves();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryData.map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg shadow ${item.color} ${item.text}`}
          >
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Leave Requests</h3>
          <button
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => router.push("/documents/form")}
          >
            <FaPlus />
            Apply Leave
          </button>
        </div>

        <div className="overflow-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Leave Type</th>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Days</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Approved By</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No leave applications found.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{leave.type || '-'}</td>
                      <td className="p-2">{leave.from || leave.leaveStartDate || '-'}</td>
                      <td className="p-2">{leave.to || leave.leaveEndDate || '-'}</td>
                      <td className="p-2">{leave.days || '-'}</td>
                      <td className="p-2">{leave.reason || '-'}</td>
                      <td className="p-2">{leave.approvedBy || '-'}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="p-2 space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
