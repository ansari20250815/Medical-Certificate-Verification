import React, { useEffect, useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from "@mui/material";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function ResumeResultsTable() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor("candidateId", { header: "Candidate ID" }),
    columnHelper.accessor("score", {
      header: "Score",
      cell: info => info.getValue().toFixed(3)
    }),
    columnHelper.accessor("suggestedKeywords", {
      header: "Suggested Keywords",
      cell: info => Array.isArray(info.getValue())
        ? info.getValue().join(", ")
        : info.getValue()
    }),
    columnHelper.accessor("rank", { header: "Rank" }),
  ], []);

  const table = useReactTable({
    data: resumes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/resume/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch resumes");
        return res.json();
      })
      .then(data => {
        setResumes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Resume Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Verification Results
      </Typography>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.header}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {cell.renderCell ? cell.renderCell() : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
