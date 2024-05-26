import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../api/apiSlice"


const tagsAdapter = createEntityAdapter()

const initialState = tagsAdapter.getInitialState()

export const tagsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTags: builder.query({
            query: () => '/tags',
            transformResponse: responseData => {
                return tagsAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => [
                { type: 'Tag', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Tag', id }))
            ]
        }),
        addTag: builder.mutation({
            query: tagName => ({
                url: '/tags',
                method: 'POST',
                body: { name: tagName },
            }),
            invalidatesTags: [{ type: 'Tag', id: "LIST" }]
        })
    })
})

export const {
    useGetTagsQuery,
    useAddTagMutation
} = tagsApiSlice
