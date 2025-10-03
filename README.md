# Do it with Juul! 💜

Een persoonlijke wekelijkse todo app met punten en beloningen, gebouwd met Next.js en Supabase.

## ✨ Features

- **Wekelijkse Todo Generatie**: Automatisch gegenereerde taken met goede impact-verdeling
- **Puntensysteem**: Laag (5pt), Middel (10pt), Hoog (20pt)
- **Beloningen**: Verdien beloningen op basis van maandelijkse punten
- **Categorieën**: Huis, DJ, Persoonlijk
- **Herhaalbare Taken**: Configureer minimum weken tussen herhalingen
- **Maandoverzicht**: Zie je voortgang en behaalde beloningen
- **Responsive Design**: Werkt perfect op mobiel en desktop

## 🚀 Quick Start

### 1. Installeer Node.js
Als je Node.js nog niet hebt geïnstalleerd:
- Download van [nodejs.org](https://nodejs.org) (LTS versie)
- Of installeer via Homebrew: `brew install node`

### 2. Installeer Dependencies
```bash
cd do-it-with-juul
npm install
```

### 3. Setup Supabase
1. Ga naar [supabase.com](https://supabase.com) en maak een account
2. Maak een nieuw project
3. Ga naar Settings → API en kopieer:
   - Project URL
   - Anon public key

### 4. Database Schema
1. Ga naar SQL Editor in je Supabase dashboard
2. Kopieer en voer uit de SQL code uit `src/lib/supabase.ts` (de `DATABASE_SCHEMA` constante)
3. Dit maakt alle tabellen en voegt voorbeelddata toe

### 5. Environment Variables
```bash
cp .env.local.example .env.local
```

Vul in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=je_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=je_supabase_anon_key
```

### 6. Start de App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser!

## 📱 Hoe te Gebruiken

### Week Tab
- **Genereer Nieuwe Week**: Klik op de knop om automatisch 5 taken te selecteren
- **Taken Afvinken**: Klik op de groene knop om taken te voltooien
- **Voortgang**: Zie je weekvoortgang in de progress bar

### Maand Tab
- **Totaal Punten**: Zie je punten voor de huidige maand
- **Beloningen**: Zie welke beloningen je hebt behaald
- **Afgeronde Taken**: Overzicht van alle voltooide taken

### Beheer Tab
- **Nieuwe Taak**: Voeg taken toe met categorie, impact en herhaalsettings
- **Beloning**: Voeg nieuwe beloningen toe met puntdrempels
- **Taken Beheren**: Zet taken actief/inactief

## 🎯 Puntensysteem

- **Laag Impact**: 5 punten (dagelijkse klusjes)
- **Middel Impact**: 10 punten (wekelijkse taken)
- **Hoog Impact**: 20 punten (belangrijke projecten)

### Weekgeneratie
- Maximum 5 taken per week
- Maximum 2 hoge impact taken
- Maximum 2 middel impact taken
- Rest wordt opgevuld met lage impact

## 🏆 Standaard Beloningen

- **50 punten**: Koffie buiten de deur
- **80 punten**: 10 euro uitgeven op Bandcamp  
- **100 punten**: Nieuw Pale tasje

Je kunt altijd meer beloningen toevoegen via de Beheer tab!

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS (paars/oranje thema)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React componenten
├── lib/                 # Utilities en database functies
└── types/              # TypeScript type definities
```

## 🚀 Deployment

### Vercel (Aanbevolen)
1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com) en importeer je repo
3. Voeg environment variables toe in Vercel dashboard
4. Deploy!

### Supabase Productie
- Je Supabase project is automatisch productie-klaar
- Voeg je Vercel domein toe aan Supabase Auth settings als je authenticatie toevoegt

## 🔧 Aanpassingen

### Puntenwaardes Wijzigen
Bewerk `getPointsForImpact()` in `src/lib/utils.ts`

### Weekinstellingen
Wijzig de standaardwaardes in de Supabase `settings` tabel

### Kleuren Aanpassen
Bewerk het kleurenschema in `tailwind.config.ts`

## 🐛 Troubleshooting

### Database Errors
- Controleer of je Supabase URL en key correct zijn
- Zorg dat je de database schema hebt uitgevoerd
- Check de Supabase logs voor details

### Build Errors
- Run `npm run lint` om TypeScript errors te vinden
- Zorg dat alle dependencies geïnstalleerd zijn

## 📝 Volgende Features

- [ ] Authenticatie voor meerdere gebruikers
- [ ] Push notificaties voor taken
- [ ] Data export/import
- [ ] Statistieken en grafieken
- [ ] Team/familie sharing

## 💜 Made with Love

Gebouwd voor Juul om haar drukke hoofd te organiseren! 

Veel plezier met je taken en geniet van je beloningen! 🎉
