import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connectDB from "@/lib/db"; 
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

					if (!user) {
						return null;
					}

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (!passwordsMatch) {
						return null;
					}

					return user;
				} catch (error) {
					console.log("Error: ", error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user._id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
};
