import {z} from 'zod'

export const formSchema = z.object({
title : z.string().min(3).max(100),
description : z.string().min(20).max(1000),
category : z.string().min(3).max(20),
link : z
    .string()
    .url()
    .refine(async (url) => {
        try {
            // Fix #4: 5-second timeout prevents the form hanging when the URL is slow or unreachable
            const res = await fetch(url, {
                method: "HEAD",
                signal: AbortSignal.timeout(5000),
            });
            const contentType = res.headers.get("content-type");
            return contentType?.startsWith("image/") ?? false;
        } catch {
            return false;
        }
    }, { message: "URL must point to a publicly accessible image file" }),
pitch : z.string().min(20),

})