const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
	// retrieve the locale requested
	const { locale } = req.params;
	// save the webpage the request came from
	const navBackTo = req.get('referer');
	// save cookies, and set a max lifetime
	res.cookie('nodeapi-locale', locale, { maxAge: 1000 * 60 * 60 * 24 *20 });
	// redirect back to the webpage
	res.redirect(navBackTo);
})

module.exports = router;