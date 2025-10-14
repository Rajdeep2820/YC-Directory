"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
export const createPitch = async (
    state : any ,
    form : FormData,
    pitch : string,

) => {
    const session = await auth();

    if(!session) return (
        parseServerActionResponse({
            error : "Not Signed In",
            status  : 'ERROR',
        })
    )

    const {title , description , category , link} = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch"),
    );

    const slug = slugify(title as string, {lower : true , strict : true});

    try{
        const existingAuthor = await client.fetch(`*[_type=="author" && _id==$id]{_id}`, { id: session.id });
if (!existingAuthor.length) {
    console.log("Author doesn't exist!");
    return parseServerActionResponse({ error: "Author missing", status: "ERROR" });
}

        const startup = {
            title,
            description,
            category,
            image : link,
            slug : {
                _type : 'slug',
                current : slug,
            },
            author : {
                _type : 'reference',
                _ref : session?.id,
            },
            pitch
        };
        const result = await writeClient.create({_type : "startup", ...startup})

        return parseServerActionResponse({
            ...result,
            error : '',
            status : "SUCCESS",
        })
    }
    catch(error){
        console.log(error)

        return parseServerActionResponse({
            error : JSON.stringify(error),
            status : "ERROR",
        })
    }
};