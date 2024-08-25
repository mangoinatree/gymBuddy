import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../api/apiSlice"


const tagsAdapter = createEntityAdapter()

const initialState = tagsAdapter.getInitialState()

export const tagsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTags: builder.query({
            query: () => '/tags',
            transformResponse: responseData => {
                const loadedTags = responseData.map(tag => {
                    tag.id = tag._id
                    return tag
                });
                const sortedTags = loadedTags.sort((a, b) => a.name.localeCompare(b.name));
                return tagsAdapter.setAll(initialState, sortedTags)
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
