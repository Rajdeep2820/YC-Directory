import React from 'react';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';

const SearchForm = ({query} : {query?: String})=>{

    
    return(
        <form action="/" className='search-form'>
        <input
        name="query" 
        defaultValue={query}
        className='search-input'
        placeholder="Enter Search"/>

        <div className='flex gap-2'>
           {query && <SearchFormReset/>} 
           <button type="submit" className='search-btn text-white'>
            <Search className='size-5'/>
           </button>
        </div>
        </form>
    )
}

export default SearchForm;