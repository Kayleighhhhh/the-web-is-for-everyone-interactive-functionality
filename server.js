// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Doe een fetch naar de data die je nodig hebt
const apiResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
const apiResponseJSON = await apiResponse.json()


console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

//maak een get route voor de home pagina
app.get('/', async function (request, response) {

  //render home.liquid
  response.render('home.liquid')
})

//maak een get route voor het overzicht van alle instrumenten
app.get('/instrumenten', async function (request, response) {

  // maar de variable soort aan om te filteren op het soort instrument
  const soort = request.query.instrument

  //maak de variable instrumentParams aan om het filter in te bewaren
  const instrumentParams = {}

  //maak een if statement om te checken of het soort instrument gefilterd wordt
  if (soort) {
    instrumentParams['filter[instrument][_eq]'] = soort
  }

  //haal de link op om het filter achter te plakken
  const instrumentsResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?' + new URLSearchParams(instrumentParams))
  //zet de data om naar json
  const instrumentsResponseJSON = await instrumentsResponse.json()

  //render overzicht.liquid en geef de data van de api en de gefilterde link mee
  response.render('overzicht.liquid', {
    instrumenten: apiResponseJSON.data,
    instrumenten: instrumentsResponseJSON.data,
    soort: soort
  })
})

//maak de route om een nieuw instrument toe te voegen met wachtwoord beveiliging
app.get('/instrumenten/nieuw', async function (request, response) {
  //stuur eerst door naar login.liquid
  response.render('login.liquid')
})

//maak een post route om het wachtwoord te controleren
app.post('/instrumenten/nieuw', async function (request, response) {

  //check met een if statement of het wachtwoord klopt
  if (request.body.password === process.env.NIEUW_INSTRUMENT) {

    //zet hier later de data om echt een nieuw instrument te posten naar de datatbase en niet vergeten kayleigh

    //laat de juiste pagina zien
    response.render('nieuw.liquid')

  //als het wachtwoord fout is stuur dit terug
  } else {
    //stuur wat terug als het fout is VERANDER DIT NAAR EEN NIEUWE PAGINA MET STYLING!! LATER
    response.send('fout wachtwoord!! ga terug naar <a href="/instrumenten/nieuw">en probeer het opnieuw</a>')
  }
})

//maak een route aan voor de detail pagina
app.get('/instrumenten/:key', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render detail.liquid en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('detail.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

//maak een route aan voor de uitleen pagina
app.get('/instrumenten/:key/aanpassen', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render login.liquid om het wachtwoord in te vullen en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('login.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

//maak een post route om het wachtwoord te controleren
app.post('/instrumenten/:key/aanpassen', async function (request, response) {
   
  //check met een if statement of het wachtwoord klopt
  if (request.body.password === process.env.EDIT_INSTRUMENT) {

    //laat de juiste pagina zien
    response.render('aanpassen.liquid')

  //als het wachtwoord fout is stuur dit terug
  } else {
    //stuur wat terug als het fout is VERANDER DIT NAAR EEN NIEUWE PAGINA MET STYLING!! LATER
    response.send('fout wachtwoord!! ga terug naar <a href="/instrumenten/uitlenen">en probeer het opnieuw</a>')
    //response.render('fout.liquid')
  }
})

//maak een route aan voor de uitleen pagina
app.get('/instrumenten/:key/uitlenen', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render login.liquid om het wachtwoord in te vullen en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('login.liquid', {
    instrument: apiResponseJSON.data,
    instrument: instrumentResponseJSON.data[0]
  })
})

//maak een post route om het wachtwoord te controleren
app.post('/instrumenten/:key/uitlenen', async function (request, response) {
   
  //check met een if statement of het wachtwoord klopt
  if (request.body.password === process.env.UITLEEN_INSTRUMENT) {

    //haal link op om de key te gebruiken in url en zet om naar json
    const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
    const instrumentResponseJSON = await instrumentResponse.json()

    //laat de juiste pagina zien
    response.render('uitlenen.liquid', {
    instrument: apiResponseJSON.data,
    instrument: instrumentResponseJSON.data[0]
  })

  //als het wachtwoord fout is stuur dit terug
  } else {
    //stuur wat terug als het fout is VERANDER DIT NAAR EEN NIEUWE PAGINA MET STYLING!! LATER
    response.send('fout wachtwoord!! ga terug naar <a href="/instrumenten/' + request.params.key + '/uitlenen">en probeer het opnieuw</a>')
  }
})

//maak een route aan voor de inneem pagina
app.get('/instrumenten/:key/innemen', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render login.liquid om het wachtwoord in te vullen en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('login.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

//maak een post route om het wachtwoord te controleren
app.post('/instrumenten/:key/innemen', async function (request, response) {
   
  //check met een if statement of het wachtwoord klopt
  if (request.body.password === process.env.INNEEM_INSTRUMENT) {

    //laat de juiste pagina zien
    response.render('innemen.liquid')

  //als het wachtwoord fout is stuur dit terug
  } else {
    //stuur wat terug als het fout is VERANDER DIT NAAR EEN NIEUWE PAGINA MET STYLING!! LATER
    response.send('fout wachtwoord!! ga terug naar <a href="/instrumenten/innemen">en probeer het opnieuw</a>')
  }
})

//maak een route aan voor de schade pagina
app.get('/instrumenten/:key/schade', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render login.liquid om het wachtwoord in te vullen en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('login.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

//maak een post route om het wachtwoord te controleren
app.post('/instrumenten/:key/schade', async function (request, response) {
   
  //check met een if statement of het wachtwoord klopt
  if (request.body.password === process.env.SCHADE_INSTRUMENT) {

    //laat de juiste pagina zien
    response.render('schade.liquid')

  //als het wachtwoord fout is stuur dit terug
  } else {
    //stuur wat terug als het fout is VERANDER DIT NAAR EEN NIEUWE PAGINA MET STYLING!! LATER
    response.send('fout wachtwoord!! ga terug naar <a href="/instrumenten/schade">en probeer het opnieuw</a>')
  }
})

/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  const fetchResponse = await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  // const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/
app.use((req, res, next) => {

  res.status(404).render('error.liquid')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
