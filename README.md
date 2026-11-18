# ✨ Humanitzador de Text IA (Anti-Detecció Turnitin & IA)

Una aplicació web moderna construïda amb **Next.js 16**, **TypeScript** i **Tailwind CSS**, dissenyada específicament per reescriure textos generats per Intel·ligència Artificial i fer-los indetectables davant eines com **Turnitin**, **GPTZero**, **CopyLeaks** i altres detectors de llenguatge artificial.

Preparada per a desplegament immediat a **Vercel**.

---

## 🚀 Característiques Principals

- **Estratègia Lingüística Anti-Detecció**:
  - **Burstiness elevada**: Variació asimètrica entre frases curtes (3-7 paraules) i frases amples i compostes (25-35 paraules).
  - **Perplexity natural**: Eliminació sistemàtica de clixés d'IA (*"és important destacar"*, *"un paper crucial"*, *"delve into"*, *"així mateix"*, etc.).
  - **Veu humana autèntica**: Transicions orgàniques i ritme natural.
- **Cadena Multi-Model amb Esgotament de Tokens (100% Gratuïta)**:
  Quan s'esgota la quota d'un model, el sistema passa automàticament al següent:
  1. `Google Gemini 2.0 Flash` (AI Studio - Quota gratuïta de màxima velocitat)
  2. `Groq Llama 3.3 70B Versatile` (Groq Cloud - Model lliure de màxima potència)
  3. `Google Gemini 1.5 Flash` (Quota separada de Google)
  4. `Groq Llama 3.1 8B Instant` (Quota d'alt rendiment a Groq)
  5. `Groq Mixtral 8x7B` (Model MoE amb un patró sintàctic diferent)
  6. `Google Gemini 1.5 Flash 8B` (Tercera quota de suport de Google)
  7. `OpenRouter Free` (Opcional si es configura)
- **Suport per a Documents**:
  - Extracció directa de fitxers **PDF** (`.pdf`)
  - Extracció de documents **Microsoft Word** (`.docx`)
  - Text pla i Markdown (`.txt`, `.md`)
  - Enganxat directe al panell d'escriptura
- **Multilingüe**: Suport complet per a **Català**, **Castellà** i **Anglès**.
- **Autenticació Flexible (NextAuth JWT)**:
  - Protegeix l'accés a les APIs de forma gratuïta.
  - Compatible 100% amb funcions *Serverless* de **Vercel** (sense dependència de fitxers SQLite locals).
  - Suporta **Google OAuth** i accés directe de convidat per provar a l'instant.

---

## 🛠️ Configuració Local

### 1. Clona el repositori i instal·la dependències
```bash
git clone <url-del-teu-repositori>
cd humanitzador-de-text
npm install
```

### 2. Configura les variables d'entorn
Copia el fitxer d'exemple:
```bash
cp .env.local.example .env.local
```

Omple les variables a `.env.local`:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-aleatori-o-executa-openssl-rand-base64-32"

# Claus gratuïtes d'IA (configura'n almenys una):
GOOGLE_GEMINI_API_KEY="la-teva-api-key-de-gemini" # https://aistudio.google.com/app/apikey
GROQ_API_KEY="la-teva-api-key-de-groq"           # https://console.groq.com/keys

# Google OAuth (Opcional - pots usar l'accés de convidat sense configurar això):
GOOGLE_CLIENT_ID="el-teu-google-client-id"
GOOGLE_CLIENT_SECRET="el-teu-google-client-secret"
```

### 3. Executa el servidor de desenvolupament
```bash
npm run dev
```

Obre el navegador a [http://localhost:3000](http://localhost:3000).

---

## ☁️ Desplegament a Vercel

1. Fes un push del codi a GitHub / GitLab.
2. Ves a [vercel.com](https://vercel.com) i importa el projecte.
3. A la secció **Environment Variables** de Vercel, afegeix:
   - `NEXTAUTH_SECRET`: Un secret aleatori (ex: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: La teva URL de Vercel (ex: `https://el-teu-projecte.vercel.app`)
   - `GOOGLE_GEMINI_API_KEY`: Clau d'API de Google AI Studio (Gratuïta)
   - `GROQ_API_KEY`: Clau d'API de Groq (Gratuïta)
   - *(Opcional)* `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` per a login Google.
4. Fes clic a **Deploy**.

---

## 🔑 On aconseguir les claus gratuïtes?

- **Google Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey) — Fes clic a "Create API Key" (100% gratuït, sense targeta).
- **Groq**: [Groq Console](https://console.groq.com/keys) — Fes clic a "Create API Key" (100% gratuït, sense targeta).
