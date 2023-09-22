# Server

- ~~autorizzare il client~~
- ~~aggiungere garanzia in purchase~~
- ~~stato del purchase (EX: RITIRATO, SOSTITUITO, SPEDITO, RIFIUTATO, RIPARATO)~~
- logica della CHAT
- aggiornare WebSecurityConfig.kt

-------------------------------------------------------------------------------

# Client

## Generali

~~NAVBAR: accedi al profilo dell'utente loggato, logout~~

~~PAGINA LOGIN NON PROTETTA - CUSTOMER / EXPERT / MANAGER~~

PAGINA SIGNUP NON PROTETTA - CUSTOMER / EXPERT

## Customer

- HOMEPAGE: ~~ticket aperti (da qui modifica), crea ticket, elenco purchase, passati,~~ crea purchase
- PAGINA SINGOLA TICKET: ~~elenco dettagli ticket, chat lato CUSTOMER,~~ chiudi ticket/segna come risolto?
- PAGINA SINGOLA ACQUISTO: elenco dettagli purchase, elenco ticket associata

- PAGINA PROFILO CUSTOMER: editare profilo

## Expert

- HOMEPAGE: ticket aperti già assegnati a me stesso (da qui interagisci), elenco ticket passati
- PAGINA SINGOLA TICKET: elenco dettagli ticket e purchase, scegli stato purchase, chat lato EXPERT

- PAGINA PROFILO EXPERT: editare profilo, scelta specializzazione

## Manager

- HOMEPAGE: elenco ticket aperti (già assegnati e non già assegnati - da qui interagisci), elenco expert
- PAGINA SINGOLA TICKET: assegna ticket all'expert (operazioni basate sullo stato del ticket), visualizza storico del ticket (tramite logs)
- PAGINA EXPERT: autorizzare expert, visualizza storico dell'expert (tramite logs)

- PAGINA PROFILO MANAGER: editare profilo