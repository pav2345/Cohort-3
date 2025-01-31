enum ResponseStatus{
    success=200,
    notfound=404,
    Error=500
}
app.get("/', (req, res) => {
    if (!req.query.userId) {
			res.status(ResponseStatus.Error).json({})
    }
    // and so on...
		res.status(ResponseStatus.Success).json({});
})