// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

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
// const apiResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments?limit=500')

// // Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()


console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

//maak een get route voor de home pagina
app.get('/', async function (request, response) {

  //render home.liquid
  response.render('home.liquid')
})

//maak een get route voor het overzicht van alle instrumenten
app.get('/instrumenten', async function (request, response) {

  

  //maak de variable Params aan om het filter in te bewaren
   const params = new URLSearchParams()

  // maar de variable soort aan om te filteren op het soort instrument
  const soort = request.query.instrument

  //maak een if statement om te checken of het soort instrument gefilterd wordt
  if (soort) {
    params.set('filter[instrument][_eq]', soort)
  }
  params.set('limit', 25)

  // console.log(params.toString())
  //haal de link op om het filter achter te plakken
  const instrumentsResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?' + params.toString())
  //zet de data om naar json
  const instrumentsResponseJSON = await instrumentsResponse.json()

  //render overzicht.liquid en geef de data van de api en de gefilterde link mee
  response.render('overzicht.liquid', {
    instrumenten: instrumentsResponseJSON.data,
    soort: soort
  })
})


app.get('/instrumenten/nieuw', async function (request, response) {

  response.render('nieuw.liquid')
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

  //render aanpassen.liquid  en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('aanpassen.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})


//maak een route aan voor de uitleen pagina
app.get('/instrumenten/:key/uitlenen', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render uitlenen.liquid  en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('uitlenen.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

app.post('/instrumenten/:key/uitlenen', async function (request, response) {
  const fetchResponse = await fetch("https://fdnd-agency.directus.app/items/preludefonds_log", {
    method: "POST",
    body: JSON.stringify({
      note: request.body.key + " is uitgeleend aan " + request.body.studentName,
      instrument: request.body.id 
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  const patchResponse = await fetch("https://fdnd-agency.directus.app/items/preludefonds_instruments/" + request.body.id, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      status: "Uitgeleend"
    })
  })

  console.log(fetchResponse)

  const fetchResponseJSON = await fetchResponse.json()
  console.log(fetchResponseJSON)
  const patchResponseJSON = await patchResponse.json()
  console.log(patchResponseJSON)

  response.redirect(303, "/instrumenten/" + request.params.key)
})


//maak een route aan voor de inneem pagina
app.get('/instrumenten/:key/innemen', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render innemen.liquid en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('innemen.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
})

app.post('/instrumenten/:key/innemen', async function (request, response) {

  const logResponse = await fetch("https://fdnd-agency.directus.app/items/preludefonds_log", {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      note: "Inname " +request.body.key + " staat: " + request.body.staat + ". Opmerking: " + request.body.opm,
      instrument: request.body.id 
    })
  })

  const patchResponse = await fetch("https://fdnd-agency.directus.app/items/preludefonds_instruments/" + request.body.id, {
    method: "PATCH",
    headers: { 
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      status: "Beschikbaar"
    })
  })

  // log de resultaten in je terminal voor controle
  console.log('Inname gelukt voor ID:', request.body.id)

  // Ga terug naar de detailpagina
  response.redirect(303, "/instrumenten/" + request.params.key)
})

//maak een route aan voor de schade pagina
app.get('/instrumenten/:key/schade', async function (request, response) {

  //haal link op om de key te gebruiken in url en zet om naar json
  const instrumentResponse = await fetch('https://fdnd-agency.directus.app/items/preludefonds_instruments/?filter[key]=' + request.params.key)
  const instrumentResponseJSON = await instrumentResponse.json()

  //render schade.liquid en geef [0] mee aan de extra info zodat hij alleen de eerste uit de array pakt
  response.render('schade.liquid', {
    instrument: instrumentResponseJSON.data[0]
  })
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
