import React from 'react'
import { useGetQuotesQuery } from './quotesSlice'
import styles from './quote.module.css'

const QuotePage = () => {
    
    const {
        data: quotes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetQuotesQuery('getQuotes')


    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess ) {
        const { ids, entities } = quotes
        const randomIndex = Math.floor(Math.random() * ids.length);
        const randomQuote = ids[randomIndex];

        content = (
           <div className={styles.quote}>
                <strong>{entities[randomQuote].text}</strong> &nbsp; <span className={styles.author}>- {entities[randomQuote].author}</span>
            </div> 
        )
        
    } else if (isError ) {
        content = <p>{error.message}</p>;
    }

    return content
}

export default QuotePage