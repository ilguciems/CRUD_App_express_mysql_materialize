const express = require('express');
const app = express();

app.get('/', function(req, res) {
	res.render('index', {title: ''});
});

module.exports = app;
