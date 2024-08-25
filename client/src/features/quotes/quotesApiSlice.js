import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../api/apiSlice"


const quotesAdapter = createEntityAdapter()

const initialState = quotesAdapter.getInitialState()

export const quotesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getQuotes: builder.query({
            query: () => '/quotes',
            transformResponse: responseData =>{
                const loadedQuotes = responseData.map(quote => {
                    quote.id = quote._id
                    return quote
                });
                return quotesAdapter.setAll(initialState, loadedQuotes)
            }
        })
    })
})

export const {
    useGetQuotesQuery
} = quotesApiSlice