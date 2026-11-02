# mConvert

Un sito per aiutare gli studenti a convertire le unità di misura del Sistema Internazionale, vedendo **la stessa misura in tre notazioni collegate**:

1. **Notazione decimale**: gli zeri segnaposto sono colorati, così si vede bene quanti sono.
2. **Tabella dei prefissi** da tera (10¹²) a pico (10⁻¹²): ogni cifra sta sopra la sua colonna e sotto ogni prefisso c'è la potenza di 10. Passando il cursore su un prefisso (o toccandolo sulla LIM) la virgola scorre e compare la conversione. Le cifre si possono trascinare a destra e a sinistra.
3. **Notazione scientifica** con l'ordine di grandezza (si può scegliere la regola: coefficiente < 5 oppure < √10).

Se modifichi una notazione, si aggiornano anche le altre. Per m² e m³ ogni prefisso occupa 2 o 3 colonne.

## Modalità
- **Conversioni**: esempi reali sempre diversi (capello, distanza Terra–Luna, piscina olimpionica…) e numeri inseriti a mano.
- **Esercitati**: ti viene data una notazione e devi ricostruire le altre, passo dopo passo: posizionare le cifre nella tabella, spostare la virgola, regolare l'esponente, scegliere l'ordine di grandezza. Quando sbagli ti dice di quante potenze di 10 sei lontano. Ci sono tre livelli.

## Tecnica
È un sito statico (HTML, CSS e JavaScript, senza build né dipendenze). I numeri sono calcolati in modo esatto, come cifre più esponente, quindi non ci sono errori di arrotondamento. Per pubblicarlo su Vercel basta importare il repository: non servono configurazioni.

Utilizzabile anche sulla LIM: ha pulsanti grandi, si usa col tocco e ha i comandi per lo schermo intero e per ingrandire il testo.
