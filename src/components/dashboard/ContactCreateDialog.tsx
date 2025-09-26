"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { createOne, validate, type Contact } from "../../data/contacts";
import useNotifications from "../../hooks/useNotifications/useNotifications";

export interface ContactCreateDialogProps {
    open: boolean;
    onClose: (created?: boolean) => void;
}

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export default function ContactCreateDialog({ open, onClose }: ContactCreateDialogProps) {

    const notifications = useNotifications();
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<ContactFormData>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Reset form when dialog opens/closes
    React.useEffect(() => {
        if (open) {
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
            });
            setErrors({});
        }
    }, [open]);

    const handleInputChange = (field: keyof ContactFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate form data
        const validation = validate(formData);
        if (validation.issues.length > 0) {
            const newErrors: Record<string, string> = {};
            validation.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    newErrors[issue.path[0]] = issue.message;
                }
            });
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await createOne(formData);
            notifications.show("Contact created successfully!", {
                severity: "success",
                autoHideDuration: 3000,
            });
            onClose(true);
        } catch (error) {

            notifications.show(
                `Failed to create contact: ${(error as Error).message}`,
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

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
            component="form"
            onSubmit={handleSubmit}
        >
            <DialogTitle>Create New Contact</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    <TextField
                        autoFocus
                        required
                        label="First Name"
                        value={formData.first_name}
                        onChange={handleInputChange("first_name")}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                        fullWidth
                        variant="outlined"
                    />

                    <TextField
                        required
                        label="Last Name"
                        value={formData.last_name}
                        onChange={handleInputChange("last_name")}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        fullWidth
                        variant="outlined"
                    />

                    <TextField
                        required
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        variant="outlined"
                    />

                    <TextField
                        required
                        label="Phone"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Contact"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

