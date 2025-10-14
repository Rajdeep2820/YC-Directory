import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
//  export const sanityClient = createClient({
//   projectId, // replace with your Sanity project ID
//   dataset,        // or your dataset name
//   apiVersion,     // use today's date or fixed version
//   useCdn: true,                // false because you need fresh data for writes
// });

