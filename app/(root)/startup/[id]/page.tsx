// /startup/2,3,4 ...here will display details of products.

import React from "react";

const Page = async({params} : {params : Promise<{id : string}>}) => {
const id = (await params).id;


return (
   <>
   <h1>ID for the startup page is : <b>{id}</b> </h1>
   </>
)
}

export default Page;