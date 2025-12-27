// lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},
			async authorize(credentials) {
				const { email, password } = credentials;
				try {
					await connectDB();
					const user = await User.findOne({ email });

					if (!user) return null;

					const passwordsMatch = await bcrypt.compare(password, user.password);
					if (!passwordsMatch) return null;

					return {
						id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
					};
				} catch (error) {
					console.log("Error: ", error);
				}
			},
		}),
	],
	session: { strategy: "jwt" },
	secret: process.env.NEXTAUTH_SECRET,
	pages: { signIn: "/login" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.role = token.role;
				session.user.id = token.id; // <--- This is the crucial part we were missing!
			}
			return session;
		},
	},
};
