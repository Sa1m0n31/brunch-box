import React from 'react'
import AboutUsSection from "./AboutUsSection";

import oNas from '../static/img/o-nas.png'
import oPomysle from '../static/img/o-pomysle.png'
import oProduktach from '../static/img/o-produktach.png'

const AboutUsContent = () => {
    return <main className="offerContent">
        <AboutUsSection
            left={true}
            image={oNas}
            title="O nas"
            content={[
                "Jesteśmy młodą parą, która dzieli wiele wspólnych zainteresowań, a z jednego z nich – gotowania – zrodził się koncept BrunchBox. Ilekroć zapraszaliśmy znajomych czy widywaliśmy się z rodziną, zawsze kładliśmy akcent na smaczne produkty i estetyczne podanie. Wierzymy, że człowiek je przede wszystkim oczami i to od oceny wizualnej nasz apetyt rośnie lub maleje.",
                "Marcela jako wegetarianka dokłada wszelkich starań, aby wege opcje były satysfakcjonującą odsłoną naszych BrunchBoxów – wkłada całe swoje serce w to, aby przekąski były zadowalające pod każdym względem, również tym samym zachęca osoby jedzące mięso do wybrania właśnie tej opcji w naszym menu.",
                "Ja natomiast sięgam po mięso sporadycznie, a jeśli już, to tylko po to „z górnej półki”. Ta suma doświadczeń ukształtowała nas i pozwoliła nam dojrzeć do prowadzenia własnego przedsiębiorstwa, które wniesie powiew świeżości do polskiej gastronomii."
            ]} />
        <AboutUsSection
            left={false}
            image={oPomysle}
            title="O pomyśle"
            content={[
                "Pomysł na BrunchBox zrodził się niejako pod wpływem wcześniejszego doświadczenia gastronomicznego. Praca zarówno w Polsce, jak i za granicą nauczyła mnie tworzyć i dopasowywać smaki w taki sposób, by zachwycały nawet najbardziej wymagające podniebienia. Potrafię docenić klasyczne połączenia smakowe, ale nie boję się także zaproponować swoich kompozycji.",
                "Koncepcja na BrunchBox jest niezwykle prosta: szacunek do produktu, estetyczne podanie i niebanalna karta. Każde działanie jako szef kuchni poprzedza świadomość, że mój Gość ma znaleźć się w centrum uwagi i to on ostatecznie wydaje opinię na temat mojej pracy. Pozwala mi to wkładać w każdy przygotowany Box maksimum umiejętności i pasji do gotowania, która stanowi najlepszą przyprawę do serwowanych przeze mnie przystawek."
            ]} />
        <AboutUsSection
            left={true}
            image={oProduktach}
            title="O produktach"
            content={[
                "Już na początku mojej gastronomicznej ścieżki, czyli białostockiego technikum gastronomicznego postanowiłem, że do swoich dań będę używać wyłącznie najlepszych produktów. Zamiast szukać oszczędności w produkcie, wolę samodzielnie wykonać więcej pracy – świadomość serwowania znakomitych zakąsek i wykorzystanie lat praktyki czyni mnie podwójnie szczęśliwym.",
                "Zasadę szacunku do produktu praktykuję po dziś dzień – widzę, że wybór lepszych jakościowo składników wynagradzany jest niekłamanym uśmiechem i ciepłymi słowami moich Gości. Podobne standardy zachowuję przy komponowaniu BrunchBoxów – włoska szynka to delikatne, rozpływające się prosciutto, ser posiada certyfikat oryginalnego pochodzenia D.O.P., a owoc smakuje świeżością, nie ma w nim chemii i sztucznych nawozów. Gwarantuję, że każdy Box posiadać będzie wyjątkowy smak, który zachwyca mnie, moją rodzinę i przyjaciół przy każdym spotkaniu."
            ]} />
        <AboutUsSection
            left={false}
            image={oNas}
            title="O opakowaniach"
            content={[
                "Estetyczne podanie jedzenia zaczyna się już od poziomu opakowań, które pełnią\n" +
                "dwojaką funkcję: z jednej strony mają chronić jedzenie przed uszkodzeniem i\n" +
                "zanieczyszczeniem, z drugiej stanowią dodatek wizualny, który podbija wspaniały\n" +
                "wygląd przekąsek. Postanowiłem pójść o krok dalej – skoro nie ma bardziej szczerej\n" +
                "miłości niż miłość do jedzenia, to może tym sposobem zechcemy obdarować drugą\n" +
                "osobę? Ta myśl sprawiła, że nasze Boxy są dostępne także w wariancie\n" +
                "prezentowym, z dołączonym bilecikiem i życzeniami.",
                "We fragmencie „o produktach” pisałem o szacunku do produktu i do Gości; tutaj\n" +
                "napiszę o szacunku do planety i środowiska. Opakowanie składa się z dwóch\n" +
                "elementów: trwałej, wytrzymałej tektury i przezroczystego okienka pochodzącego\n" +
                "z recyklingowanego plastiku. Zarówno jeden, jak i drugi element można ponownie\n" +
                "oddać do recyklingu, można też tchnąć drugie życie w opakowanie, wykorzystując\n" +
                "je jako np. organizer, szkatułkę czy karton prezentowy. Dzięki temu wszyscy –\n" +
                "zarówno ja, jak i Wy – możemy oszczędzać energię, redukować zużycie wody i" +
                "prądu przez wtórne wykorzystanie opakowań. "
            ]} />
        <AboutUsSection
            left={true}
            image={oPomysle}
            title="O usłudze"
            content={[
                "Jak możecie zauważyć, BrunchBox to specjalna kategoria w zakresie gastronomii\n" +
                "take-away. Nie jest to ani dowóz jedzenia na telefon, ponieważ tworząc\n" +
                "kompozycje BrunchBoxów nie ścigamy się z czasem, by za 30 minut dowieźć Ci\n" +
                "jedzenie. Nie jest to też catering dietetyczny, który wymaga wykupienia pewnego\n" +
                "abonamentu czy codziennego żywienia. Nie jest to także standardowy catering,\n" +
                "który obsługuje imprezy na kilkadziesiąt osób.",
                "Tworząc BrunchBoxy, stawiam przede wszystkim na spotkania dnia codziennego –\n" +
                "wspólny brunch w pracy, wieczór przy piwie ze znajomymi czy poczęstunek dla\n" +
                "odwiedzającej rodziny. Produkty wewnątrz Boxów mają za zadanie wprowadzić\n" +
                "wyjątkowy smak i estetyczne podanie zakąsek właśnie w takiej prozie życia, którą\n" +
                "najczęściej pomijamy lub której umniejszamy. Ty oddasz się swobodnej rozmowie,\n" +
                "a ja zadbam o wrażenia smakowe Twoich Gości lub osoby obdarowanej przez Ciebie\n" +
                "przygotowanym BrunchBoxem."
            ]} />
        <AboutUsSection
            left={false}
            image={oProduktach}
            title="O nadchodzących usługach"
            content={[
                "Wiecie już, czym jest BrynchBox, jednocześnie otrzymaliście dość sporo informacji\n" +
                "na temat całej koncepcji. Nie oznacza to jednak, że zamkniemy się w tym jednym\n" +
                "produkcie – stopniowo będziemy urzeczywistniać nasze pomysły. Sam produkt\n" +
                "będzie udoskonalany na podstawie Waszych opinii i wspólnych doświadczeń,\n" +
                "jednocześnie będziemy poszerzać oferowane wariacje składników. Już w trakcie\n" +
                "powstawania strony wprowadziliśmy pewną innowację, jaką jest specjalne\n" +
                "opakowanie prezentowe.",
                "Wraz z rozwojem na naszej stronie pojawi się oferta franczyzowa, która będzie\n" +
                "dedykowana zróżnicowanemu zapotrzebowaniu zgłaszanemu w innych miastach.\n" +
                "Chcemy wychodzić poza Warszawę i współpracować z pasjonatami jedzenia,\n" +
                "produktu i estetycznego podania. Jeśli więc sądzisz, że możesz poprowadzić z nami\n" +
                "projekt BrunchBox we Wrocławiu, Krakowie, Gdańsku czy innym mieście –\n" +
                "skontaktuj się z nami! Razem z narzeczoną rozważamy też kilka innych projektów,\n" +
                "jak na przykład oferta alkoholi z różnych zakątków świata, które nie są dostępne w\n" +
                "standardowych sklepach. Do tego kompletny pairing wspomnianych alkoholi z\n" +
                "zakąskami… ale o ostatecznej realizacji pomysłu zadecydujemy dopiero w\n" +
                "przyszłości. Na ten moment cieszę się, że mogę Wam zaproponować BrunchBoxy,\n" +
                "ponieważ – w myśl Salvadora Dali – „można nie jeść w ogóle, ale nie można jeść\n" +
                "źle”."
            ]} />

    </main>
}

export default AboutUsContent;
