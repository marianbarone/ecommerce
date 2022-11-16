export const errorHandler = (err, res) => {
    return res
        .status(err.status)
        .render('error.ejs');
};