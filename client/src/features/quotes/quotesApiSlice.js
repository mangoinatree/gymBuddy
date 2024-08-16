import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../api/apiSlice"


const quotesAdapter = createEntityAdapter()

const initialState = quotesAdapter.getInitialState()

export const quotesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getQuotes: builder.query({
            query: () => '/quotes',
            transformResponse: responseData =>{
                return quotesAdapter.setAll(initialState, responseData)
            }
        })
    })
})

export const {
    useGetQuotesQuery
} = quotesApiSlice