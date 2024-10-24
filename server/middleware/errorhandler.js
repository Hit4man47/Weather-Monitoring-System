const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // MongoDB errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).json({
            error: 'Database error occurred'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message
        });
    }

    // Default error
    res.status(500).json({
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred'
    });
};