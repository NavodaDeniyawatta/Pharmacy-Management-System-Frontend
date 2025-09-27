import * as React from "react";
import { useLocation } from "react-router";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit"; // Fix import

export default function DataTable({ rows, columns, onEdit, onDelete }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const tableRef = React.useRef(null);
  const location = useLocation(); // Get current location path
  const [userType, setUserType] = React.useState("");

  React.useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const parsedData = JSON.parse(storedUserData);
    if (storedUserData) {
      setUserType(parsedData.userType);
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      tableRef.current.requestFullscreen().catch((err) => {
        console.error("Error trying to enable fullscreen", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Extend columns to include action buttons
  const actionColumn =
    userType !== "Customer"
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <>
                <IconButton onClick={() => onEdit(params.row)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(params.row.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]
      : [];

  const enhancedColumns = [
    ...columns.map((col) => ({ ...col, flex: 1 })),
    ...actionColumn,
  ];

  // Custom Toolbar Component
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px",
        }}
      >
        {/* Left Side - Search Bar */}
        <GridToolbarQuickFilter style={{ flexGrow: 1, maxWidth: "300px" }} />

        {/* Right Side - Other Buttons */}
        <div className="flex gap-5">
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
          <IconButton onClick={toggleFullscreen} color="primary">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </div>
      </GridToolbarContainer>
    );
  }

  // Function to set row background color based on status
  const getRowClassName = (params) => {
    if (location.pathname === "/stock") {
      switch (params.row.status) {
        case "Available":
          return "bg-green-200"; // Light green background
        case "Low Stock":
          return "bg-yellow-200"; // Light yellow background
        case "Out of Stock":
          return "bg-red-200"; // Light red background
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div
      ref={tableRef}
      style={{
        height: "62vh",
        width: "100%",
        backgroundColor: "#ffffff",
        zIndex: 0,
      }}
    >
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        pageSizeOptions={[5, 10, 20]}
        pagination
        getRowHeight={() => 80}
        slots={{ toolbar: CustomToolbar }}
        getRowClassName={getRowClassName}
        disableRowSelectionOnClick
      />
    </div>
  );
}
