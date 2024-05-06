import React from 'react';
import { useParams } from 'react-router-dom';

import ReviewList from '../component/ReviewList';
import BusinessInfo from '../component/BusinessInfo';
import TrendChart from '../component/TrendChart';

export default function BusinessPage() {
    const { business_id } = useParams();

    return (
        <div className="container">
            <BusinessInfo business_id={business_id} />
            <ReviewList business_id={business_id} />
            <TrendChart business_id={business_id} />
        </div>
    )
}
