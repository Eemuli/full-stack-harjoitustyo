# Full Stack -ohjelmointi: Harjoitustyön palautus

HyppyNet: Laskuvarjohyppypäiväkirja

TTC2080-3012

12.12.2022

Rantala Eemil [AA2875]

Oma arvio harjoitustyön korottavasta vaikutuksesta: 2

Julkaistu sovellus (vaatii LabraNet VPN): http://172.21.7.126/

[Lähdekoodi](https://gitlab.labranet.jamk.fi/AA2875/full-stack-harjoitustyo/-/tree/main/V2)

[Esittely video](https://youtu.be/A69I_Ek8Ilw)

___

## Kuvaus

Tavoitteena oli rakentaa opintojakson aihealueeseen liittyvä Full Stack -sovellus. Työn sai tehdä 1-3 hengen ryhmässä, mutta valitsin tehdä kokonaan yksin. Työ on tehty täysin omalla ajalla, mutta tarjolla oli myös muutamia tunteja ohjausta. Työn aiheen sai valita vapaasti, mutta se piti hyväksyttää opettajalla. 

Laskuvarjo harrastuksesta innostuneena päätin tehdä niin sanotusta hyppypäiväkirjasta netti version. Normaalisti se on paperinen vihko, mutta sinne käsin kaiken kirjoittaminen jokaisen hypyn jälkeen käy tylsäksi. Hyppypäivä kirjassa on ylhäällä jokaisen hypyn perustiedot lentokoneesta päävarjoon.

Rakensin sovelluksen kurssilla opettajan tekemän esimerkki sovelluksen päälle. Lopullisessa työssä opettajan koodista on vain rippeet. Lähinnä CRUD reittien ohjelmoinnin rakenne on sama ja palvelinpuolen ohjelmointi vain laajempi.

## Itsearvio

**Vahvuudet**

- Sovellus on toimiva ja selkeä käyttää.
- Käytin laajasti kurssilla opittuja asoita.
- Lisäksi opettelin hieman kurssin ulkopuolisia asioita. Lähinnä DOM:in muokkaamiseen liittyvää.
- Käytin kaikkia CRUD metodeja.
- Syötteillä on jonkinasteinen tarkistus. Myöskään vaajaata lomaketta ei pysty lähettämään.
- Hyppy järjestyksen muuttaminen on kiva lisä. Sen tekeminen tuotti yksittäisestä asiasta eniten haasteita.
- Kenttien automaattinen täyttö osottautui käteväksi, vaikka tällä hetkellä vain hyppy numero ja vapaapudotusaika yht. täyttyvät.
- Yksittäisen tiedon muokkaaminen arvoa klikkaamalla tuo näppäryyttä muokkaamiseen.
- Hyppyä poistettaessa tulee mahdollisuus peruuttaa poisto 2.5s ajan.
- Sovellus laskee kokonaisvapaapudotusajan ja esittää sen minuutit ja sekunnit muodossa.
- Kommentin ja linkin voi lisätä myös jälkikäteen.
- Linkkiin lisäytyy https:// jos syötetty linkki ei ala sillä.
- Sivusto EI käytä evästeitä ;D


**Heikkoudet ja kehitysideat**

- Sovellusta ei ole julkaistu internettiin kaikille testattavaksi.
- Kirjautumis mahdollisuus ja profiili kohtaiset hyppytiedot olisi pakollisuus jos sovellus haluttaisiin oikeaan käyttöön.
- Haku tai suodatus tulisi käteväksi kun hyppyjä on satoja.
- Kun muokkaa koko hyppyä kerralla (kynä kuvake), niin kokonaisaika ei näy tallennuksen jälkeen minuutit, sekunnit -muodossa. Tätä työstin viimeisenä päivä pitkään mutta palautuspäivä tuli vastaan.
- Saman numeroisen hypyn voi lisätä useamman kerran. Pitäisi tehdä tarkistus sille.
- Päivämäärä kohtaan kalenteri valikko ja nappi josta voi valita kuluvan päivän helposti.
- Myös paikka, lentokone ja päävarjo kentät voisivat täyttyä edellisen hypyn perusteella. Nämä tiedot harvoin muuttuvat, niin tulee turhaa toistoa kirjoittaa ne aina.
- Youtube videon voisi upottaa tietolaatikkoon automaattisesti.
- Sivulla näytettäisiin vain n määrä hyppyjä kerrallaan.
- Osa funktioista on turhan pitkiä.

**Muuta**

En kommentoinut koodia lainkaan, vaan pyrin nimeämään muuttujat ja funktiot siten että ne kommentoisivat itse itseään. Tämäkään ei osoittautunut parhaaksi valinnaksi, sillä moni funktioista on turhan pitkiä ja tekee tavallaan useampaa asiaa. Jatkossa pilkkoisin funktioita pienempiin palasiin.

## Tekniset tiedot

Käytetyt kielet: HTML, CSS ja Javascript

Palvelinohjelmointi: NodeJS, jossa käytössä: Mongoose, Express, Cors

Tietokanta: MongoDB

### Julkaisu

Sovellus on julkaistu JAMK:in tarjoaman Virtual Learning Environment (VLE) Ubuntuun, jossa Apache2 HTTP-palvelin ja PM2 backend palvelin NodeJS:lle. Julkaistussa versiossa [`code.js`](./V2/page/code.js) tiedoston `localhost:3000` kohdat on korvattu palvelimen osoitteella `172.21.7.126:8080`.

### Funktioista

Sivun bodyn ladattua kutsutaan alustus funktiota, joka näyttää sivulle, että tietoja aletaan lataamaan ja asettaa globaalin muuttujan hyppyjen esitys järjestyksestä laskevaksi. Samalla se käynnistää asynkronisen tietojen lataus funktion. Tietojen latauduttua tietokannasta, funktio tekee siitä JSON muotoisen objektin ja antaa sen parametrina `showJumps` funktiolle.

`showJumps` järjestää JSON tiedoston hyppynumeroiden perusteella laskevasti tai nousevasti em. globaalin muuttujan perusteella. Tämän jälkeen jokainen hyppy annetaan parametrina `createJumpListItem` funktiolle joka luo jokaisesta `<li>` objektin sivulle ja lisää niille hyppynumeron ja päivän. Lopuille hypyn tiedoille on erillinen `jumpItemFullInfo` funktio, ettei pääfunktio olisi liian suuri. Sillä lisätään hyppy elementin sisälle lista lopuista tiedoista, mutta ne on oletuksena piilotettuna.

Funktiot joilla voidaan tallentaa, muokata ja poistaa hyppyjä, saavat parametrina klikatun objektin id:n, jonka avulla saadaan muutos oikeaan objektiin.

Yleisesti ottaen ohjelman funktiot ottavat parametreina joko tietokannan genereoiman id:n tai kohteena olevan elementin.

### Muuta

Sovelluksessa hyppytiedot tallennetaan tietokantaan. Nappien kuvakkeet on tallennettuna palvelimelle. Fontti haetaan googlen avoimesta rajapinnasta.

## Ajankäyttö

Aloitin työn tekemisen jo syyskuussa, eli kurrsin puolivälissä. Silloin tein alustavaa ulkoasua kirjautumissivun muodossa. Se jäi hautumaan pitkäksi aikaa ennen kuin aloitin kunnolla noin pari viikkoa ennen palautus päivää. Siitä työstin lähes joka päivä niin paljon kuin ehti.