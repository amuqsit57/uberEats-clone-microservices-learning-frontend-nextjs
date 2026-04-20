import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


const handler = NextAuth({
    providers:[
        Credentials({

            name:"Credentials",

            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}

                },
            async authorize(credentials) {
                    const res = await fetch('http://localhost:3000/api/auth/login', {
                        method:'POST',
                        headers:{'Content-Type':
                            'application/json'
                        },
                        body:JSON.stringify({
                            email:credentials?.email,
                            password:credentials?.password
                        })

                    })
                    const user = await res.json()

                    if(!res.ok || !user){
                        throw new Error(user.message)
                    }
                    return user
            },

            }
        )
    ],
    session:{
        strategy:"jwt"
    },
    callbacks:{
        async jwt({token,user}){
         if(user) token.user = user
         return token
        },

        async session({session,token}){
            if(token) session.user = token.user as any
            return session
        }
    },

    secret:process.env.NEXTAUTH_SECRET
})


export {handler as GET, handler as POST}