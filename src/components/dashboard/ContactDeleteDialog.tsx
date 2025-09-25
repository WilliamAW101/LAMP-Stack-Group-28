"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { deleteOne, type Contact } from "../../data/contacts";
import useNotifications from "../../hooks/useNotifications/useNotifications";

export interface ContactDeleteDialogProps {
    open: boolean;
    contact: Contact | null;
    onClose: (deleted?: boolean) => void;
}

export default function ContactDeleteDialog({ open, contact, onClose }: ContactDeleteDialogProps) {
    const notifications = useNotifications();
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        if (!contact) return;

        setLoading(true);
        try {
            await deleteOne(contact.id);
            notifications.show(
                `${contact.first_name} ${contact.last_name} has been deleted successfully.`,
                {
                    severity: "success",
                    autoHideDuration: 3000,
                }
            );
            onClose(true);
        } catch (error) {
            notifications.show(
                `Failed to delete contact: ${(error as Error).message}`,
                {
                    severity: "error",
                    autoHideDuration: 5000,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose(false);
    };

    if (!contact) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this contact? This action cannot be undone.
                </DialogContentText>

                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                        Contact Details:
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            <strong>Name:</strong> {contact.first_name} {contact.last_name}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Email:</strong> {contact.email}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Phone:</strong> {contact.phone}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleCancel}
                    disabled={loading}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete Contact"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
