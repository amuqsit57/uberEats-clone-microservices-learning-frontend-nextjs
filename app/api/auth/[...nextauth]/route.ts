import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const AUTH_BASE_URL = process.env.AUTH_BASE_URL ?? "http://localhost:5000";
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;


const handler = NextAuth({
    providers:[
        Credentials({

            name:"Credentials",

            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}

                },
            async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
                        method:'POST',
                        headers:{'Content-Type':
                            'application/json'
                        },
                        body:JSON.stringify({
                            email:credentials?.email,
                            password:credentials?.password
                        })

                    })
                    const payload = await res.json()

                    if(!res.ok || !payload){
                        throw new Error(payload?.message ?? "Invalid credentials")
                    }

                    const user = payload?.user ?? payload?.data?.user ?? payload
                    const accessToken = payload?.token ?? payload?.accessToken ?? payload?.data?.token

                    if (!user) {
                        throw new Error("Invalid login response")
                    }

                    return {
                        ...user,
                        accessToken,
                    }
            },

            }
        )
    ],
    session:{
        strategy:"jwt",
        maxAge: SEVEN_DAYS_IN_SECONDS
    },
    jwt: {
        maxAge: SEVEN_DAYS_IN_SECONDS,
    },
    callbacks:{
        async jwt({token,user}){
         const mutableToken = token as typeof token & { user?: unknown; accessToken?: string }

         if(user) {
            mutableToken.user = user
            const userToken = (user as { accessToken?: string }).accessToken
            if (userToken) {
                mutableToken.accessToken = userToken
            }
         }

         return mutableToken
        },

        async session({session,token}){
            const mutableSession = session as typeof session & { accessToken?: string }
            const mutableToken = token as typeof token & { user?: unknown; accessToken?: string }

            if(mutableToken.user) {
                mutableSession.user = mutableToken.user as any
            }

            if (mutableToken.accessToken) {
                mutableSession.accessToken = mutableToken.accessToken
            }

            return mutableSession
        }
    },

    secret:process.env.NEXTAUTH_SECRET
})


export {handler as GET, handler as POST}