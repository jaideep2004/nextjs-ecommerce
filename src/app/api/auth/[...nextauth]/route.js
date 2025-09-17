import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('NextAuth signIn callback triggered');
      console.log('User:', user.email);
      console.log('Account provider:', account?.provider);
      
      if (account.provider === 'google') {
        try {
          await connectToDatabase();
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
              isAdmin: false,
            });
            console.log('Created new Google user:', user.email, 'with ID:', newUser._id);
          } else {
            // Update existing user with Google info if they signed up with email
            if (!existingUser.provider) {
              existingUser.provider = 'google';
              existingUser.providerId = account.providerAccountId;
              existingUser.image = user.image;
              await existingUser.save();
              console.log('Updated existing user with Google info:', user.email);
            } else {
              console.log('Existing Google user signing in:', user.email);
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin;
            token.userId = dbUser._id;
            console.log('JWT callback: Added user data to token for', user.email);
          }
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.isAdmin = token.isAdmin;
        session.user.userId = token.userId;
        console.log('Session callback: User session created for', session.user.email);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };