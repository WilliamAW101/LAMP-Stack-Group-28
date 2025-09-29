"use client"

import React, { Suspense } from "react";
import ContactList from "@/components/dashboard/ContactList";
import WelcomeMessage from "@/components/dashboard/WelcomeMessage";
import { Container } from "@mui/material";

function ContactsContent() {
    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <WelcomeMessage />
            <ContactList />
        </Container>
    )
}

export default function ContactsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactsContent />
        </Suspense>
    )
}
