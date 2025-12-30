import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Digital E Gram Panchayat",
	description: "Citizen services portal",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextTopLoader color="#0f766e" height={3} showSpinner={false} />

			
				<Toaster position="top-right" richColors closeButton />

				<Providers>{children}</Providers>
			</body>
		</html>
	);
}