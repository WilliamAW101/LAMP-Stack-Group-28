"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridEventListener,
  gridClasses,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useUser } from "../../context/user/UserContext";
import {
  getMany as getContacts,
  type Contact,
} from "../../data/contacts";
import PageContainer from "./PageContainer";
import ContactCreateDialog from "./ContactCreateDialog";
import ContactEditDialog from "./ContactEditDialog";
import ContactDeleteDialog from "./ContactDeleteDialog";

const INITIAL_PAGE_SIZE = 10;

export default function ContactList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useUser();

  // Mounted ref to avoid state updates after unmount
  const isMounted = React.useRef(true);
  // Request ID to track current request and ignore stale responses
  const currentRequestId = React.useRef(0);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: Number(searchParams.get("page") || "0"),
      pageSize: Number(
        searchParams.get("pageSize") || INITIAL_PAGE_SIZE.toString()
      ),
    });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() => {
    const filter = searchParams.get("filter");
    return filter ? JSON.parse(filter) : { items: [] };
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>(() => {
    const sort = searchParams.get("sort");
    return sort ? JSON.parse(sort) : [];
  });

  // Sync state with URL parameters when they change
  React.useEffect(() => {
    const page = Number(searchParams.get("page") || "0");
    const pageSize = Number(searchParams.get("pageSize") || INITIAL_PAGE_SIZE.toString());
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");

    setPaginationModel(prev => {
      if (prev.page !== page || prev.pageSize !== pageSize) {
        return { page, pageSize };
      }
      return prev;
    });

    const newFilterModel = filter ? JSON.parse(filter) : { items: [] };
    setFilterModel(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newFilterModel)) {
        return newFilterModel;
      }
      return prev;
    });

    const newSortModel = sort ? JSON.parse(sort) : [];
    setSortModel(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newSortModel)) {
        return newSortModel;
      }
      return prev;
    });
  }, [searchParams]);

  const [rowsState, setRowsState] = React.useState<{
    rows: Contact[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editContactId, setEditContactId] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteContact, setDeleteContact] = React.useState<Contact | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Ensure we're on the client side before making API calls
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Effect: loads all contacts at once (client-side pagination)
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }

    // If not client yet, wait for client-side hydration
    if (!isClient) {
      return;
    }

    // Generate unique request ID for this request
    const requestId = ++currentRequestId.current;

    const fetchData = async () => {
      if (!isMounted.current || requestId !== currentRequestId.current) return;

      setError(null);
      setIsLoading(true);

      try {
        const token = getToken();

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        // Load all contacts at once for client-side pagination
        const listData = await getContacts({
          paginationModel: { page: 0, pageSize: 1000 }, // Get all contacts
          sortModel,
          filterModel,
          searchValue,
        });

        // Only update state if this is still the current request
        if (requestId === currentRequestId.current && isMounted.current) {
          setRowsState({
            rows: listData.items,
            rowCount: listData.items.length, // Use actual items count for client-side pagination
          });
          setIsInitialized(true);
        }
      } catch (listDataError: unknown) {

        // Only show error if this is still the current request
        if (requestId === currentRequestId.current && isMounted.current) {
          setError(listDataError as Error);
        }
      } finally {
        // Only update loading state if this is still the current request
        if (requestId === currentRequestId.current && isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [sortModel, filterModel, refreshKey, searchValue, getToken, isClient]); // Added all dependencies

  /**
   * Effect: refresh data when component mounts (after navigation)
   */
  React.useEffect(() => {
    if (isMounted.current && isClient) {
      setRefreshKey(prev => prev + 1);
    }
  }, [isClient]);

  /**
   * Effect: refresh data when navigating to this page
   */
  React.useEffect(() => {
    if (isMounted.current) {
      // Force a refresh when the component mounts (navigation)
      // Add a small delay to ensure component is fully mounted
      setTimeout(() => {
        if (isMounted.current) {
          setRefreshKey(prev => prev + 1);
        }
      }, 100);
    }
  }, []); // Empty dependency array - runs on mount

  /**
   * Effect: handle search with debouncing
   */
  React.useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      // Trigger refresh to fetch new data with search
      setRefreshKey(prev => prev + 1);
    }, 200); // 200ms debounce for faster search response

    return () => clearTimeout(timeoutId);
  }, [searchValue, isClient]);

  /**
   * Handlers
   */
  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationModel) => {
      // Update state immediately for better UX
      setPaginationModel(model);

      // Update URL for bookmarking (optional for client-side pagination)
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(model.page));
      params.set("pageSize", String(model.pageSize));

      const newSearchParamsString = params.toString();
      const newUrl = `/contacts${newSearchParamsString ? "?" : ""}${newSearchParamsString}`;

      // Use replace to avoid creating unnecessary history entries
      router.replace(newUrl);
    },
    [router, searchParams]
  );




  const handleRefresh = React.useCallback(() => {
    if (!isLoading && isMounted.current) {
      const requestId = ++currentRequestId.current;

      const fetchData = async () => {
        if (!isMounted.current || requestId !== currentRequestId.current) return;

        setError(null);
        setIsLoading(true);

        try {
          const listData = await getContacts({
            paginationModel: { page: 0, pageSize: 1000 }, // Get all contacts
            sortModel,
            filterModel,
            searchValue,
          });

          // Only update state if this is still the current request
          if (requestId === currentRequestId.current && isMounted.current) {
            setRowsState({
              rows: listData.items,
              rowCount: listData.items.length, // Use actual items count
            });
          }
        } catch (listDataError: unknown) {
          // Only show error if this is still the current request
          if (requestId === currentRequestId.current && isMounted.current) {
            setError(listDataError as Error);
          }
        } finally {
          // Only update loading state if this is still the current request
          if (requestId === currentRequestId.current && isMounted.current) {
            setIsLoading(false);
          }
        }
      };

      fetchData();
    }
  }, [isLoading, sortModel, filterModel, searchValue]);

  const handleRowClick = React.useCallback<GridEventListener<"rowClick">>(
    ({ row }) => {
      router.push(`/contacts/${row.id}`);
    },
    [router]
  );

  const handleCreateClick = React.useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleCreateDialogClose = React.useCallback((created?: boolean) => {
    setCreateDialogOpen(false);
    if (created) {
      // Refresh the list after successful creation
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  const handleEditDialogClose = React.useCallback((updated?: boolean) => {
    setEditDialogOpen(false);
    setEditContactId(null);
    if (updated) {
      // Refresh the list after successful update
      setRefreshKey(prev => prev + 1);
    }
  }, []);

  const handleDeleteDialogClose = React.useCallback((deleted?: boolean) => {
    setDeleteDialogOpen(false);
    setDeleteContact(null);
    if (deleted) {
      // Refresh the list after successful deletion
      setRefreshKey(prev => prev + 1);
    }
  }, []);


  const handleRowEdit = React.useCallback(
    (contact: Contact) => () => {
      setEditContactId(contact.id);
      setEditDialogOpen(true);
    },
    []
  );

  const handleRowDelete = React.useCallback(
    (contact: Contact) => () => {
      setDeleteContact(contact);
      setDeleteDialogOpen(true);
    },
    []
  );

  /**
   * DataGrid columns
   */
  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "first_name", headerName: "First Name", width: 140 },
      { field: "last_name", headerName: "Last Name", width: 140 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Phone", width: 140 },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        align: "right",
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete]
  );

  const pageTitle = "Contacts";

  return (
    <PageContainer
      title={pageTitle}
      actions={
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          spacing={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Tooltip title="Reload data" placement="right" enterDelay={1000}>
              <div>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={handleRefresh}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Tooltip>
            <TextField
              size="small"
              placeholder="Search by first name or last name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchValue("")}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: '100%', sm: 250 },
                width: { xs: '100%', sm: 'auto' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: searchValue ? 'action.hover' : 'transparent',
                }
              }}
            />
          </Stack>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: 'auto', sm: 'auto' }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Create</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>

        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : !isClient ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
            flexDirection: 'column',
            gap: 2
          }}>
            <div>Initializing...</div>
          </Box>
        ) : !isInitialized ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
            flexDirection: 'column',
            gap: 2
          }}>
            <div>Loading contacts...</div>
          </Box>
        ) : rowsState.rows.length === 0 ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
            flexDirection: 'column',
            gap: 2
          }}>
            <div>
              {searchValue ? `No contacts found matching "${searchValue}"` : 'No contacts found'}
            </div>
            {searchValue ? (
              <Button
                variant="outlined"
                onClick={() => setSearchValue("")}
                startIcon={<ClearIcon />}
              >
                Clear search
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleCreateClick}
                startIcon={<AddIcon />}
              >
                Create your first contact
              </Button>
            )}
          </Box>
        ) : (
          <>
            {searchValue && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing results for &quot;{searchValue}&quot;
                </Typography>
                <Button
                  size="small"
                  onClick={() => setSearchValue("")}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>
            )}
            <Suspense fallback={<div>Loading DataGrid...</div>}>
              <DataGrid
                rows={rowsState.rows}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                disableRowSelectionOnClick
                onRowClick={handleRowClick}
                loading={isLoading}
                hideFooterSelectedRowCount
                disableColumnMenu
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: INITIAL_PAGE_SIZE },
                  },
                }}
                pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                sx={{
                  [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                    outline: "transparent",
                  },
                  [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                  {
                    outline: "none",
                  },
                  [`& .${gridClasses.row}:hover`]: {
                    cursor: "pointer",
                  },
                }}
                slotProps={{
                  loadingOverlay: {
                    variant: "circular-progress",
                    noRowsVariant: "circular-progress",
                  },
                  baseIconButton: {
                    size: "large",
                  },
                  pagination: {
                    labelRowsPerPage: "Rows per page:",
                    labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) => {
                      if (count === -1) {
                        return `${from}–${to}`;
                      }
                      return `${from}–${to} of ${count}`;
                    },
                    showFirstButton: true,
                    showLastButton: true,
                  },
                }}
              />
            </Suspense>
          </>
        )}
      </Box>

      <ContactCreateDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />

      <ContactEditDialog
        open={editDialogOpen}
        contactId={editContactId}
        onClose={handleEditDialogClose}
      />

      <ContactDeleteDialog
        open={deleteDialogOpen}
        contact={deleteContact}
        onClose={handleDeleteDialogClose}
      />

    </PageContainer>
  );
}
