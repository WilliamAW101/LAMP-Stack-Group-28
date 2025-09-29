"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { deleteOne, type Contact } from "../../data/contacts";
import { useToast } from "@/context/toast";

export interface ContactDeleteDialogProps {
    open: boolean;
    contact: Contact | null;
    onClose: (deleted?: boolean) => void;
}

export default function ContactDeleteDialog({ open, contact, onClose }: ContactDeleteDialogProps) {
    const toast = useToast();
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        if (!contact) return;

        setLoading(true);
        try {
            await deleteOne(contact.id);
            toast.success(`${contact.first_name} ${contact.last_name} has been deleted successfully.`);
            onClose(true);
        } catch (error) {
            toast.error(`Failed to delete contact: ${(error as Error).message}`);
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
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                }
            }}
        >
            {/* Header with Warning Icon */}
            <Box sx={{
                p: 3,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
                <Avatar sx={{
                    bgcolor: 'error.light',
                    width: 48,
                    height: 48
                }}>
                    <WarningIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight={600} color="error">
                        Delete Contact
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone
                    </Typography>
                </Box>
            </Box>

            <DialogContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
                    Are you sure you want to permanently delete this contact? All associated data will be lost.
                </Typography>

                {/* Contact Information Card */}
                <Box sx={{
                    p: 3,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    mb: 2
                }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                        Contact Information
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            fontSize: '1rem',
                            fontWeight: 600
                        }}>
                            {contact.first_name[0]}{contact.last_name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {contact.first_name} {contact.last_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Contact ID: #{contact.id}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'grid', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={500} sx={{ minWidth: 60, color: 'text.secondary' }}>
                                Email:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {contact.email}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={500} sx={{ minWidth: 60, color: 'text.secondary' }}>
                                Phone:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {contact.phone}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                p: 3,
                pt: 2,
                gap: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
                <Button
                    onClick={handleCancel}
                    disabled={loading}
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    sx={{
                        minWidth: 120,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color="error"
                    disabled={loading}
                    startIcon={loading ? null : <DeleteIcon />}
                    sx={{
                        minWidth: 140,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                        }
                    }}
                >
                    {loading ? "Deleting..." : "Delete Contact"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
