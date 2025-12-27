import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},

			async authorize(credentials) {
				const { email, password } = credentials;

				try {
					await connectDB();
					const user = await User.findOne({ email });

					if (!user) {
						return null; // User not found
					}

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (!passwordsMatch) {
						return null; // Wrong password
					}

					// Return the object we want to store in the token
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
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login", // Points to our custom login page
	},
	callbacks: {
		// 1. Add role/id to the JSON Web Token
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}
			return token;
		},
		// 2. Add role/id to the Session (so we can use it in the frontend)
		async session({ session, token }) {
			if (session?.user) {
				session.user.role = token.role;
				session.user.id = token.id;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
