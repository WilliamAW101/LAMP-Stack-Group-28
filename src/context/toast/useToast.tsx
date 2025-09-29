"use client"

import { AlertColor } from "@mui/material"
import { createContext, FC, ReactNode, useContext, useState } from "react"
import { Toast, ToastStyle } from "./Toast"

export interface ToastMessage {
    message: string
    severity: AlertColor
    key: number
    autoHideDuration?: number
}

export const ToastContext = createContext<{
    addMessage: (message: ToastMessage) => void
}>(null as never)

export const ToastProvider: FC<{ children: ReactNode } & ToastStyle> = ({
    children,
    ...props
}) => {
    const [messages, setMessages] = useState<ToastMessage[]>([])

    const removeMessage = (key: number) =>
        setMessages((arr) => arr.filter((m) => m.key !== key))

    return (
        <ToastContext.Provider
            value={{
                addMessage(message) {
                    setMessages((arr) => [...arr, message])
                },
            }}
        >
            {children}
            {messages.map((m) => (
                <Toast
                    key={m.key}
                    message={m}
                    onExited={() => removeMessage(m.key)}
                    {...props}
                />
            ))}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const { addMessage } = useContext(ToastContext)

    const show = (message: string, options: { severity: AlertColor; autoHideDuration?: number } = { severity: "info" }) => {
        addMessage({ message, ...options, key: new Date().getTime() })
    }

    return {
        show,
        info(message: string, options?: { autoHideDuration?: number }) {
            show(message, { severity: "info", ...options })
        },
        success(message: string, options?: { autoHideDuration?: number }) {
            show(message, { severity: "success", ...options })
        },
        warning(message: string, options?: { autoHideDuration?: number }) {
            show(message, { severity: "warning", ...options })
        },
        error(message: string, options?: { autoHideDuration?: number }) {
            show(message, { severity: "error", ...options })
        },
    }
}
