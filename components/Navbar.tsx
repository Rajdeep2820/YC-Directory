 //"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut, signIn } from '@/auth'
import { getProviders } from 'next-auth/react';
const Navbar = async () => {
    const session = await auth();
    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
            <nav className='flex justify-between items-center'>
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={144} height={30}></Image>
                </Link>

                <div className='flex items-center gap-5 text-black'>
                    {session && session.user ? (
                        <>
                            <Link href="/startup/create">
                                <span>Create</span>
                            </Link>

                            <form action={async () => {
                                "use server";

                                await signOut({ redirectTo: "/" });

                            }}>
                                <button type="submit">Logout</button>
                            </form>

                            <Link href={`/user/${session?.id}`}>
                                <div className="flex items-center gap-3">
                                <span ><b>{session?.user?.name}</b></span>
                                <Image src="https://lh3.googleusercontent.com/a/ACg8ocLislkjXRWlvRibYx-1OP0KbGEFphTfWVyh_93OHubWN-hVzw=s96-c" alt="logo" width={40} height={40}></Image>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <form action={async () => {
                            "use server";

                            await signIn('google');

                        }}>
                            <button type="submit">
                                Login
                            </button>
                        </form>
                    )}
                </div>
            </nav>
        </header>

    )
}

export default Navbar;