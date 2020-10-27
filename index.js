const express    = require('express')
const path       = require('path')
const PORT       = process.env.PORT || 5000
const transpiler = require( 'php-transpiler' );
const bodyParser = require( 'body-parser' );
const app        = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({
	   extended: true,
	   limit: '50mb'
	}))
  .use( bodyParser.json() )
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get( '/', (req, res) => res.render('pages/index', { phpCode: '<?php \n', jsCode: 'JS will show up here.' }))
  .post('/', function(req, res) {
	let translator = new transpiler( {
		browser: true,
	} );
	let jsCode  = '';
	let phpCode = 'string' === typeof req.body.data ? req.body.data : '';
	if ( 'string' === typeof req.body.data ) {
	  	if ( ! phpCode.includes( '<?' ) ) {
	  		phpCode = '<?php \n' + phpCode;
	  	}
		jsCode = translator.read( req.body.data );
	}
	
	  res.render('pages/index', { phpCode: phpCode, jsCode: jsCode })
	})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))