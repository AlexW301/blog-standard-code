import React from "react";
import Image from "next/image";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "../Logo/Logo"

export default function AppLayout({children, availableTokens, posts, postId}) {
  const {user} = useUser();
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col overflow-hidden text-white">
        <div className="px-2 bg-slate-800">
          <div>
            <Logo/>
          </div>
          <Link
            href={`/post/new`}
            className="btn"
          >
            New Post
          </Link>
          <Link href={`/token-topup`} className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="flex-1 px-4 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
              <Link key={post._id} href={`/post/${post._id}`} className={`block px-2 my-1 overflow-hidden rounded-sm cursor-pointer text-ellipsis whitespace-nowrap bg-white/10 border border-transparent py-1 ${postId === post._id ? "bg-white/20 border-white" : ""}`}>{post.topic}</Link>
            ))}
        </div>
        <div className="flex items-center h-20 gap-2 px-2 border-t bg-cyan-800 border-t-black/50">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image src={user.picture} alt={user.name} height={50} width={50} className="rounded-full" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href={`/api/auth/logout`}>
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href={`/api/auth/login`}>Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
