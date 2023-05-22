exports.getErrorMessage = (err) => {
    let errorMessage = err.message;

    if (err.errors) { // if mongoose errors
        errorMessage = Object.values(err.errors)[0].message;
    }

    return errorMessage;
}