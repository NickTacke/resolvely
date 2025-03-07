# Planningsdocument voor Resolvely Ticketsysteem

## Projectoverzicht
Resolvely is een modern ticketsysteem ontworpen om ondersteuningsteams te helpen bij het bijhouden en oplossen van klantvragen. Het project is gebouwd met de modernste technologieën om schaalbaarheid, prestaties en gebruiksgemak te garanderen.

## Technische Keuzes & Motivaties

### Tech Stack

| Technologie | Motivatie |
|-------------|-----------|
| **Next.js** | Gekozen vanwege de servercomponenten die ons helpen de initiële laadtijd te verbeteren. De app-router structuur zorgt voor een overzichtelijke codebase en betere prestaties voor onze klanten. |
| **TypeScript** | Implementatie van typeveiligheid helpt ons ontwikkelteam bugs vroeg in het ontwikkelproces te identificeren, wat de ontwikkelingssnelheid verhoogt en productkwaliteit verbetert. |
| **Prisma** | ORM zorgt voor type-veilige database-interacties, waardoor SQL-injectie wordt voorkomen en het werken met de database vereenvoudigt. |
| **PostgreSQL** | Gekozen vanwege robuustheid en schaalbaarheid. We hebben specifiek voor PostgreSQL gekozen in plaats van MySQL vanwege betere ondersteuning voor JSON-velden, wat onze flexibiliteit bij toekomstige uitbreidingen vergroot. |
| **tRPC** | Biedt end-to-end typeveiligheid tussen frontend en backend, wat de ontwikkelingservaring verbetert en fouten in API-aanroepen vermindert. |
| **NextAuth.js** | Vereenvoudigt authenticatie met meerdere providers (Google, GitHub, Discord). De JWT-strategie maakt onze authenticatie stateless, wat de horizontale schaalbaarheid verbetert. |
| **Shadcn/UI** | Biedt toegankelijke en aanpasbare componenten die consistent zijn met onze ontwerpstandaarden, terwijl we de volledige controle over de code behouden zonder externe afhankelijkheden. |
| **Tailwind CSS** | Versnelt de UI-ontwikkeling en zorgt voor consistentie in de hele applicatie. De utility-first aanpak vermindert de CSS-bestandsgrootte en verbetert de prestaties. |

### Architecturale Beslissingen

1. **App Router**: We hebben voor de App Router van Next.js gekozen in plaats van Pages Router vanwege betere ondersteuning voor servercomponenten en verbeterde prestaties.

2. **Server Components**: Waar mogelijk gebruiken we servercomponenten om de hoeveelheid JavaScript die naar de client wordt gestuurd te verminderen, wat resulteert in snellere laadtijden.

3. **Command-Query Separation**: We scheiden leesoperaties (queries) en schrijfoperaties (mutations) in onze tRPC routers, wat het gemakkelijker maakt om de logica te onderhouden en uit te breiden.

4. **Gelaagde Architectuur**: Het project volgt een gelaagde architectuur met duidelijke scheiding tussen UI-componenten, pagina's, API-endpoints en databaselogica.

## Huidige Projectstatus

De volgende onderdelen zijn al geïmplementeerd:

- ✅ Projectsetup met T3 stack
- ✅ Databaseschema ontwerp
- ✅ Backend tRPC API voor tickets (CRUD)
- ✅ Basis ticket model & Prisma integratie
- ✅ Frontend ticketpagina's
- ✅ Styling met Shadcn/ui
- ✅ Gebruikersauthenticatie met NextAuth.js
- ✅ Beschermde routes
- ✅ Ticket status- en prioriteitsbeheer
- ✅ Ticket toewijzing
- ✅ Filteren, sorteren en zoeken
- ✅ Opmerkingen op tickets
- ✅ Basisstatistieken & grafieken

## Planning voor Resterende Functionaliteiten

### 1. Gebruikersbeheer (Admin Panel)
**Geschatte tijd: 3-4 weken**

Het ontwikkelen van een uitgebreid administratiepaneel voor gebruikersbeheer, inclusief:
- Gebruikersrollen en -rechten beheren
- Gebruikers toevoegen/verwijderen/bewerken
- Team- en afdelingsbeheer
- Activiteitslogboeken bekijken

Dit is een cruciale functionaliteit die we hebben uitgesteld omdat we eerst de core functionaliteit van het ticketbeheer wilden perfectioneren.

### 2. Geavanceerde Autorisatielogica
**Geschatte tijd: 2 weken**

Implementatie van role-based access control (RBAC):
- Definiëren van rollen (admin, agent, gebruiker)
- Fijnmazige toegangscontrole voor verschillende delen van de applicatie
- Integratie met bestaande NextAuth-systeem

### 3. Notificatiesysteem
**Geschatte tijd: 3 weken**

Ontwikkeling van een uitgebreid notificatiesysteem:
- In-app notificaties
- E-mailnotificaties
- Webhooks voor integratie met externe systemen
- Notificatie-instellingen per gebruiker

We hebben hiervoor gekozen voor een event-driven architectuur die zal worden geïmplementeerd met een achtergrondverwerker.

### 4. Rich Text Editor voor Ticketbeschrijvingen
**Geschatte tijd: 1-2 weken**

Integratie van een rich text editor voor het verbeteren van ticketbeschrijvingen:
- Ondersteuning voor opmaak (vet, cursief, links)
- Afbeeldingen invoegen
- Codeblokken met syntax highlighting
- Mogelijkheid om te citeren

We hebben besloten om TipTap te gebruiken vanwege de aanpasbaarheid en het feit dat het gebaseerd is op ProseMirror.

### 5. Bestandsbijlagen
**Geschatte tijd: 2-3 weken**

Implementatie van bestandsbijlagen voor tickets:
- Drag-and-drop uploaden
- Voorbeeldweergave van afbeeldingen en documenten
- Bestandsbeheer (verwijderen, hernoemen)
- Integratie met een opslagservice (S3 of vergelijkbaar)

### 6. Uitgebreide Rapportage & Analyses
**Geschatte tijd: 3-4 weken**

Verbetering van het analysedashboard:
- Aangepaste rapportages
- Exportmogelijkheden (CSV, PDF)
- Geavanceerde visualisaties en grafieken
- Prestatie-indicatoren en SLA-tracking

### 7. Testen
**Geschatte tijd: 3 weken (doorlopend)**

Ontwikkeling van geautomatiseerde tests:
- Unittests voor componenten en utilities
- Integratietests voor API-endpoints
- End-to-end tests met Playwright
- Performancetests

### 8. Implementatie & Deployment
**Geschatte tijd: 1-2 weken**

Voorbereiden en uitvoeren van de productie-deployment:
- CI/CD-pipeline opzetten
- Vercel of AWS deployment configureren
- Monitoringsystemen instellen
- Documentatie en handleidingen

## Tijdlijn en Prioriteiten

| Fase | Functionaliteit | Start Datum | Eind Datum |
|------|----------------|------------|-----------|
| 1 | Gebruikersbeheer (Admin Panel) | 15 maart 2025 | 12 april 2025 |
| 2 | Geavanceerde Autorisatielogica | 15 maart 2025 | 29 maart 2025 |
| 3 | Notificatiesysteem | 1 april 2025 | 22 april 2025 |
| 4 | Rich Text Editor | 22 april 2025 | 6 mei 2025 |
| 5 | Bestandsbijlagen | 7 mei 2025 | 28 mei 2025 |
| 6 | Uitgebreide Rapportage | 1 juni 2025 | 28 juni 2025 |
| 7 | Testen (doorlopend) | 15 maart 2025 | 10 juli 2025 |
| 8 | Deployment | 15 juli 2025 | 30 juli 2025 |
