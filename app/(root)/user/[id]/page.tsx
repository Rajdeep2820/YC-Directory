import { auth } from "@/auth";
import StartupList from "@/components/StartupList";
import { type StartupTypeCard } from "@/components/StartupCard";
import { getAuthorById, getStartupsByAuthor } from "@/lib/startups";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 300;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [author, startups, session] = await Promise.all([
    getAuthorById(id),
    getStartupsByAuthor(id),
    auth(),
  ]);

  if (!author) notFound();

  const displayName = author.name || author.username || "Entrepreneur";
  const profileImage = author.image || "https://placehold.co/220x220";
  const startupHeading = session?.id === author._id ? "Your Startups" : "Startups";

  return (
    <section className="profile_container">
      <aside className="profile_card">
        <div className="profile_title">
          <h1 className="text-24-black text-center line-clamp-1">{displayName}</h1>
        </div>

        <Image
          src={profileImage}
          alt={`${displayName}'s profile picture`}
          width={220}
          height={220}
          className="profile_image"
          priority
        />

        <p className="mt-7 text-30-extrabold">@{author.username || "entrepreneur"}</p>
        <p className="mt-2 text-center text-14-normal">{author.bio || "Building the next big idea."}</p>
      </aside>

      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <h2 className="text-30-bold">{startupHeading}</h2>
        {startups.length > 0 ? (
          <StartupList posts={startups as StartupTypeCard[]} />
        ) : (
          <p className="no-result">No startups submitted yet.</p>
        )}
      </div>
    </section>
  );
};

export default Page;
