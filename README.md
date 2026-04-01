# Interactive Functionality

Deze sprint heb ik gewerkt aan een interactieve webapplicatie voor het beheren, uitlenen, aanpassen en schademelden van muziekinstrumenten. Dit project focust op een gebruiksvriendelijke interface.
## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
Dit project is een beheer-dashboard voor instrumenten. Het stelt gebruikers in staat om nieuwe instrumenten te registreren, bestaande gegevens aan te passen en schades te documenteren inclusief foto-uploads.

<img width="1917" height="862" alt="detail pagina" src="https://github.com/user-attachments/assets/c55c7118-b354-47f3-bd86-7ac5fb232227" />


De focus lag op het maken van een responsive website die gebruikmaakt van moderne CSS-technieken.

Bekijk het [resultaat](https://the-web-is-for-everyone-interactive-z9ny.onrender.com/) 🌐

## Gebruik
### User Story
"Als muziekdocent van de Cool Kunst en Cultuur wil ik op mijn telefoon snel een instrument kunnen uitlenen aan een leerling, zodat de collectie altijd up-to-date is."

### Functionaliteiten
Instrument Toevoegen: Een intuïtief formulier met duidelijke placeholders.

Status Patch: Via verschillende formulieren de status van een instrument bijwerken via een PATCH-methode naar 'beschikbaar', 'uitgeleend' of 'in reparatie'.

Gegevens Aanpassen: Bestaande data wijzigen via een overzichtelijke layout.

Schademeldingen: Een apart systeem voor historie en nieuwe meldingen.



## Kenmerken
In dit project heb ik keuzes gemaakt om de kwaliteit en schaalbaarheid goed te houden tijdens het maken van een nette layout:

### HTML & Liquid
Semantische Structuur: Er is gebruikgemaakt van HTML5 elementen zoals <section>, <article>, <fieldset> en <figure>. Divjes zijn alleen gebruikt als het echt nodig was.

### CSS
Mobile First: De styling begint bij de kleinste schermen. Media queries met een (min-width) worden gebruikt om de layout uit te breiden naar desktop.

CSS Nesting: Er is gebruikgemaakt van de nieuwe CSS-nesting om de CSS overzichtelijk te houden.

Relatieve Eenheden: Om goede toegankelijkheid en responsiviteit te houden, worden geen pixels gebruikt. Alle maten zijn geschreven in rem en em.

CSS Grid & Flexbox: Grid en flexbox zijn gebruikt voor formulieren en uitlijning van actieknoppen.

## Installatie
<!-- Bij Installatie staat hoe een andere developer aan jouw repo kan werken -->


## Bronnen

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
