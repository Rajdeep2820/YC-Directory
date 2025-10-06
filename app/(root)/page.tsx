import Image from "next/image";
import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";
import { client } from "@/sanity/lib/client";
import { STARTUP_QUERY } from "@/sanity/lib/queries";
import { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";



export default async function Home({searchParams} : { 

  searchParams : Promise<{query?:string}>
}){
  const query = (await searchParams).query;
  const {data : posts} = await sanityFetch( { query: STARTUP_QUERY})

  console.log(JSON.stringify(posts, null, 2));

  // const posts = [{
  //   _createdAt : new Date(),
  //   views : 56,
  //   author : { _id : 1 , name : 'Zack'},
  //   description : 'this is a description',
  //   image : 'https://images.unsplash.com/photo-1731762524352-b5663f83a830?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //   category : 'Roboss',
  //   title : 'We Robos'
  // }]
  return (
    <>
    <section className="pink_container">
    <h1 className="heading">Pitch Your Startup, <br />Connect with Entrepreneurs</h1>
    <p className="sub-heading !max-w-3xl">Submit Ideas, Vote on pitches, and Get Noticed in Virtual Competitions. </p>

    <SearchForm query={query}/>
    </section>

    <section className="section_container">
      <p className="text-30-semibold">
        {query ? `Searching for ${query}` : "All Startups"}
        
      </p>

      <ul className="mt-7 card_grid">
        {posts.length > 0 ? (
          posts.map((post : StartupTypeCard)=>(
            <StartupCard key={post._id} post={post} />
          ))
        ): (
          <p className="no-startups"> No startups found</p>
        )}
      </ul>
    </section>
        <SanityLive/>
    </>
  );
}
