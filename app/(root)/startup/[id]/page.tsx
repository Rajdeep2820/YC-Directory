// /startup/2,3,4 ...here will display details of products.
import React from "react";
import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { getStartupById } from "@/lib/startups";
import Link from "next/link";
import Image from "next/image";
import markdownit from 'markdown-it';
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdownit();
export const revalidate = 300;
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
   const id = (await params).id;
   const post = await getStartupById(id);
   if (!post) return notFound();

   const parsedContent = md.render(post?.pitch || " ");
   return (
      <>
         <section className="pink_container !min-h-[230px]">
            <p className="tag">{formatDate(post?._createdAt)}</p>
            <h1 className="heading"> {post.title}</h1>
            <p className="sub-heading max-w-5xl">{post?.description}</p>
         </section>

         <section className="section_container">
            <div className="w-xl items-center">
               <Image
                  src={post.image || "https://placehold.co/800x450"}
                  alt={`${post.title || "Startup"} thumbnail`}
                  width={800}
                  height={450}
                  className="w-[800px] h-[450px] mx-auto rounded-xl object-cover" />
            </div>

            <div className="space-y-5 mt-10 max-w-4xl mx-auto">
               <div className="flex-between gap-5">
                  <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
                     <Image src={post.author.image} alt="avatar" width={64} height={64} className="rounded-full drop-shadow-lg" />

                     <div>
                        <p className="text-20-medium">{post.author.name}</p>
                        <p className="text-16-medium !text-black-300">@{post.author.username}</p>
                     </div>
                  </Link>
                  <p className="category-tag">{post.category}</p>
               </div>

               <h3 className="text-30-bold">Pitch Details</h3>
               {parsedContent ? (
                  <article  className= "prose max-w-4xl font-work-sans break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} />
               ) : (
                  <p className="no-result"> No Details Found!</p>
               )}
            </div>

            <hr className="divider"/>
            {/*TODO : Editor selected startups... */}

            <Suspense fallback={<Skeleton className="view_skeleton"/>}>
            <View id={id} initialViews={post.views ?? 0}/>
            </Suspense>

         </section>

      </>
   )
}

export default Page;
