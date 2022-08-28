import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const DelayedSpinner = ({ size }) => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSpinner(true), 400);

        return () => clearTimeout(timer);
    });

    return showSpinner && <LoadingSpinner />;
};

export default DelayedSpinner;