import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
    ]
};

export const metadata: Metadata = {
    title: "Fundamentals Dashboard",
    description: "A starting point for portfolio research",
    manifest: "/site.webmanifest",
    icons: {
        apple: [
            { url: "/images/icons/apple-touch-icon.png", sizes: "180x180" }
        ],
        icon: [
            { url: "/images/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/images/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon.ico", sizes: "any" }
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/images/icons/safari-pinned-tab.svg",
                color: "#5bbad5"
            }
        ]
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}

