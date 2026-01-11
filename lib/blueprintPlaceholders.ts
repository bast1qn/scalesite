export const icons = {
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>`,
    paintbrush: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a2.25 2.25 0 012.245 2.4 3 3 0 001.128 5.78m-1.128-5.78a15.998 15.998 0 00-1.62-3.385m3.387 1.62a15.998 15.998 0 01-3.388 1.62m-1.62-3.385a2.25 2.25 0 012.245-2.4 3 3 0 005.78-1.128 4.5 4.5 0 00-8.4 2.245c0 .399.078.78.22 1.128zm0 0V11.25" /></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`,
};

const defaultContent = {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Professionelle Lösungen für [Firma].", subtitle: "Wir sind Ihr Partner für nachhaltigen Erfolg und innovative Ideen." },
                { 
                    type: 'services', 
                    title: 'Unsere Leistungen',
                    items: [
                        { title: "Service A", description: "Eine Beschreibung für den ersten Service, der die Kernkompetenz hervorhebt.", icon: icons.sparkles },
                        { title: "Service B", description: "Der zweite Service, der ein weiteres wichtiges Geschäftsfeld abdeckt.", icon: icons.code },
                        { title: "Service C", description: "Ein dritter Service, der das Angebot abrundet und Mehrwert schafft.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Starten wir gemeinsam durch!" },
            ],
        },
        leistungen: {
            sections: [
                { type: 'pageHeader', title: "Unsere Leistungen" },
                { 
                    type: 'services', 
                    title: 'Alle Services im Detail',
                    items: [
                        { title: "Service A", description: "Eine Beschreibung für den ersten Service, der die Kernkompetenz hervorhebt.", icon: icons.sparkles },
                        { title: "Service B", description: "Der zweite Service, der ein weiteres wichtiges Geschäftsfeld abdeckt.", icon: icons.code },
                        { title: "Service C", description: "Ein dritter Service, der das Angebot abrundet und Mehrwert schafft.", icon: icons.paintbrush },
                    ],
                },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Über Uns" },
                { type: 'textBlock', content: "Hier steht eine detaillierte Beschreibung über das Unternehmen [Firma], seine Geschichte, Mission und die Werte, die es vertritt. Dieser Text gibt potenziellen Kunden einen tieferen Einblick." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontakt" },
                { type: 'contactForm', title: "Schreiben Sie uns" },
            ]
        },
    }
};

export const placeholderContent: { [key: string]: any } = {
  dienstleistung: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Exzellente Beratung, die Resultate schafft.", subtitle: "Wir helfen Unternehmen wie Ihrem, komplexe Herausforderungen zu meistern und nachhaltiges Wachstum zu erzielen." },
                { 
                    type: 'services', 
                    title: "Unsere Kernkompetenzen",
                    items: [
                        { title: "Strategieberatung", description: "Wir entwickeln zukunftsfähige Strategien, die Ihr Unternehmen voranbringen.", icon: icons.sparkles },
                        { title: "Prozessoptimierung", description: "Effizientere Abläufe für mehr Produktivität und geringere Kosten.", icon: icons.code },
                        { title: "Digitalisierung", description: "Wir begleiten Sie auf dem Weg in die digitale Zukunft.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Sind Sie bereit für den nächsten Schritt?" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Beratungsfelder" },
                { 
                    type: 'services', 
                    title: "Unsere Kernkompetenzen",
                    items: [
                        { title: "Strategieberatung", description: "Wir entwickeln zukunftsfähige Strategien, die Ihr Unternehmen voranbringen.", icon: icons.sparkles },
                        { title: "Prozessoptimierung", description: "Effizientere Abläufe für mehr Produktivität und geringere Kosten.", icon: icons.code },
                        { title: "Digitalisierung", description: "Wir begleiten Sie auf dem Weg in die digitale Zukunft.", icon: icons.paintbrush },
                    ],
                },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unsere Mission" },
                { type: 'textBlock', content: "Bei [Firma] ist es unsere Mission, durch maßgeschneiderte Beratungsleistungen einen messbaren Mehrwert für unsere Kunden zu schaffen. Wir glauben an Partnerschaft auf Augenhöhe und datengestützte Entscheidungen, um Ihr Unternehmen zielsicher in die Zukunft zu führen." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontaktieren Sie uns" },
                { type: 'contactForm', title: "Wir freuen uns auf Ihre Anfrage" },
            ]
        },
    }
  },
  handwerk: {
    pages: {
         home: {
            sections: [
                { type: 'hero', title: "Meisterhaftes Handwerk. Für Sie gefertigt.", subtitle: "[Firma] realisiert Ihre Wohnträume mit Leidenschaft und Präzision." },
                { 
                    type: 'services', 
                    title: "Was wir tun",
                    items: [
                        { title: "Möbel nach Maß", description: "Individuelle Einzelstücke, perfekt auf Ihre Wünsche und Räume zugeschnitten.", icon: icons.paintbrush },
                        { title: "Innenausbau", description: "Vom Boden bis zur Decke – wir gestalten Lebensräume mit Charakter.", icon: icons.code },
                        { title: "Restaurierung", description: "Wir erhalten Werte und lassen alte Schätze in neuem Glanz erstrahlen.", icon: icons.sparkles },
                    ],
                },
                { type: 'cta', title: "Lassen Sie uns Ihr Projekt besprechen." },
            ]
        },
        leistungen: {
            sections: [
                { type: 'pageHeader', title: "Unsere Leistungen" },
                 { 
                    type: 'services', 
                    title: "Was wir tun",
                    items: [
                        { title: "Möbel nach Maß", description: "Individuelle Einzelstücke, perfekt auf Ihre Wünsche und Räume zugeschnitten.", icon: icons.paintbrush },
                        { title: "Innenausbau", description: "Vom Boden bis zur Decke – wir gestalten Lebensräume mit Charakter.", icon: icons.code },
                        { title: "Restaurierung", description: "Wir erhalten Werte und lassen alte Schätze in neuem Glanz erstrahlen.", icon: icons.sparkles },
                    ],
                },
            ]
        },
        überuns: {
             sections: [
                { type: 'pageHeader', title: "Unsere Werkstatt" },
                { type: 'textBlock', content: "Seit Generationen steht der Name [Firma] für traditionelles Handwerk, verbunden mit modernen Techniken. Wir verwenden nur die hochwertigsten Materialien und legen Wert auf jedes Detail, um langlebige und ästhetische Ergebnisse zu schaffen." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Ihre Anfrage" },
                { type: 'contactForm', title: "Schildern Sie uns Ihr Vorhaben" },
            ]
        },
    }
  },
  ecommerce: {
     pages: {
         home: {
            sections: [
                { type: 'hero', title: "Entdecken Sie unsere Kollektion.", subtitle: "Bei [Firma] finden Sie handverlesene Produkte, die Qualität und Stil vereinen." },
                { 
                    type: 'products', 
                    title: "Bestseller",
                    items: [
                        { name: "Premium Produkt 1", price: "49,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Exklusives Produkt 2", price: "79,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Limitiertes Produkt 3", price: "129,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Klassiker Produkt 4", price: "39,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
                { type: 'cta', title: "Bereit für ein einzigartiges Shopping-Erlebnis?" },
            ]
        },
        shop: {
             sections: [
                { type: 'pageHeader', title: "Alle Produkte" },
                { 
                    type: 'products', 
                    title: "Unsere Kollektion",
                    items: [
                        { name: "Premium Produkt 1", price: "49,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Exklusives Produkt 2", price: "79,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Limitiertes Produkt 3", price: "129,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Klassiker Produkt 4", price: "39,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Neuheit Produkt 5", price: "59,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Special Edition 6", price: "99,99 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
            ]
        },
        überuns: {
             sections: [
                { type: 'pageHeader', title: "Unsere Story" },
                { type: 'textBlock', content: "[Firma] wurde aus einer Leidenschaft für außergewöhnliche Produkte gegründet. Wir reisen um die Welt, um für Sie nur das Beste zu finden. Jedes Produkt in unserem Shop wird sorgfältig ausgewählt und erzählt seine eigene Geschichte." },
            ]
        },
        kontakt: {
             sections: [
                { type: 'pageHeader', title: "Kundenservice" },
                { type: 'contactForm', title: "Haben Sie Fragen?" },
            ]
        },
    }
  },
  gastronomie: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Genussmomente, die in Erinnerung bleiben.", subtitle: "Willkommen bei [Firma], wo traditionelle Küche auf moderne Kreationen trifft." },
                { 
                    type: 'services', 
                    title: "Unsere kulinarische Welt",
                    items: [
                        { title: "Frische Zutaten", description: "Wir beziehen unsere Produkte von regionalen Anbietern für maximale Qualität.", icon: icons.sparkles },
                        { title: "Saisonale Karte", description: "Unsere Speisekarte wechselt regelmäßig und bietet das Beste jeder Jahreszeit.", icon: icons.paintbrush },
                        { title: "Events & Feiern", description: "Planen Sie Ihre nächste Feier bei uns in einem unvergesslichen Ambiente.", icon: icons.code },
                    ],
                },
                { type: 'cta', title: "Reservieren Sie Ihren Tisch" },
            ]
        },
        speisekarte: {
             sections: [
                { type: 'pageHeader', title: "Unsere Speisekarte" },
                { type: 'textBlock', content: "Hier finden Sie einen Auszug aus unserer aktuellen Speisekarte. Von klassischen Gerichten bis hin zu saisonalen Spezialitäten – bei uns ist für jeden Geschmack etwas dabei. Alle Gerichte werden frisch für Sie zubereitet." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unsere Geschichte" },
                { type: 'textBlock', content: "[Firma] ist mehr als nur ein Restaurant. Es ist ein Ort der Begegnung, an dem Gastfreundschaft und die Liebe zum guten Essen im Mittelpunkt stehen. Erfahren Sie mehr über unsere Philosophie und unser Team." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Besuchen Sie uns" },
                { type: 'contactForm', title: "Reservierung & Anfrage" },
            ]
        },
    }
  },
  arztpraxis: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Ihre Gesundheit in besten Händen.", subtitle: "Willkommen in der Praxis [Firma]. Wir nehmen uns Zeit für Sie und Ihr Wohlbefinden." },
                { 
                    type: 'services', 
                    title: "Unsere Schwerpunkte",
                    items: [
                        { title: "Vorsorge", description: "Prävention ist die beste Medizin. Wir beraten Sie umfassend zu allen Vorsorgeuntersuchungen.", icon: icons.sparkles },
                        { title: "Diagnostik", description: "Moderne Ausstattung und fundiertes Fachwissen für eine präzise Diagnosestellung.", icon: icons.code },
                        { title: "Therapie", description: "Individuelle und ganzheitliche Behandlungspläne für Ihre Genesung.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Vereinbaren Sie einen Termin" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Unser Leistungsspektrum" },
                { type: 'textBlock', content: "Wir bieten ein breites Spektrum an medizinischen Leistungen an. Von der allgemeinen Grundversorgung über spezielle Therapien bis hin zu modernen Diagnoseverfahren. Informieren Sie sich hier über unsere Angebote." },
            ]
        },
        team: {
            sections: [
                { type: 'pageHeader', title: "Unser Praxisteam" },
                { type: 'textBlock', content: "Bei [Firma] kümmert sich ein engagiertes und erfahrenes Team aus Ärzten und medizinischen Fachangestellten um Ihre Gesundheit. Wir legen Wert auf eine persönliche und vertrauensvolle Atmosphäre." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Sprechzeiten & Anfahrt" },
                { type: 'contactForm', title: "Terminanfrage" },
            ]
        },
    }
  },
  fotografie: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Momente für die Ewigkeit festhalten.", subtitle: "Professionelle Fotografie mit Herz und Auge für das Detail von [Firma]." },
                { 
                    type: 'products', 
                    title: "Portfolio Highlights",
                    items: [
                        { name: "Hochzeitsreportage", price: "ab 1.200 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Portrait-Shooting", price: "ab 250 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Business & Corporate", price: "auf Anfrage", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Eventfotografie", price: "auf Anfrage", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
                { type: 'cta', title: "Lassen Sie uns Ihre Geschichte erzählen." },
            ]
        },
        portfolio: {
             sections: [
                { type: 'pageHeader', title: "Mein Portfolio" },
                { 
                    type: 'products', 
                    title: "Ausgewählte Arbeiten",
                    items: [
                        { name: "Hochzeitsreportage", price: "ab 1.200 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Portrait-Shooting", price: "ab 250 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Business & Corporate", price: "auf Anfrage", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Eventfotografie", price: "auf Anfrage", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
            ]
        },
        übermich: {
            sections: [
                { type: 'pageHeader', title: "Über Mich" },
                { type: 'textBlock', content: "Mein Name ist [Inhaber/in von Firma] und Fotografie ist meine Leidenschaft. Ich liebe es, authentische Momente einzufangen und Geschichten in Bildern zu erzählen. Mein Stil ist natürlich, modern und emotional." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Shooting anfragen" },
                { type: 'contactForm', title: "Schreiben Sie mir" },
            ]
        },
    }
  },
  immobilien: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Ihr Zuhause ist unsere Mission.", subtitle: "Professionelle Immobilienvermittlung mit [Firma]." },
                { 
                    type: 'products', 
                    title: "Aktuelle Angebote",
                    items: [
                        { name: "Moderne Stadtvilla", price: "890.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Helles Loft-Apartment", price: "450.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Familienhaus im Grünen", price: "620.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Exklusives Penthouse", price: "1.200.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
                { type: 'cta', title: "Finden oder verkaufen Sie Ihre Immobilie." },
            ]
        },
        angebote: {
             sections: [
                { type: 'pageHeader', title: "Immobilienangebote" },
                { 
                    type: 'products', 
                    title: "Alle Objekte",
                    items: [
                        { name: "Moderne Stadtvilla", price: "890.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Helles Loft-Apartment", price: "450.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Familienhaus im Grünen", price: "620.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Exklusives Penthouse", price: "1.200.000 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Ihr Maklerteam" },
                { type: 'textBlock', content: "Mit [Firma] haben Sie einen erfahrenen und engagierten Partner an Ihrer Seite. Wir kennen den lokalen Markt wie unsere Westentasche und setzen uns mit vollem Einsatz für Ihre Ziele ein – egal ob Sie verkaufen oder kaufen möchten." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontakt & Beratung" },
                { type: 'contactForm', title: "Vereinbaren Sie einen Beratungstermin" },
            ]
        },
    }
  },
  anwaltskanzlei: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Ihr Recht. Unsere Kompetenz.", subtitle: "Die Kanzlei [Firma] vertritt Ihre Interessen – engagiert, professionell und lösungsorientiert." },
                { 
                    type: 'services', 
                    title: "Unsere Rechtsgebiete",
                    items: [
                        { title: "Arbeitsrecht", description: "Wir beraten Arbeitnehmer und Arbeitgeber in allen arbeitsrechtlichen Fragen.", icon: icons.sparkles },
                        { title: "Mietrecht", description: "Kompetente Vertretung für Mieter und Vermieter bei rechtlichen Auseinandersetzungen.", icon: icons.code },
                        { title: "Verkehrsrecht", description: "Schnelle und unkomplizierte Hilfe nach Verkehrsunfällen und bei Bußgeldbescheiden.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Vereinbaren Sie ein Erstgespräch" },
            ]
        },
        rechtsgebiete: {
             sections: [
                { type: 'pageHeader', title: "Unsere Rechtsgebiete" },
                { type: 'textBlock', content: "Wir bieten umfassende rechtliche Beratung und Vertretung in einer Vielzahl von Rechtsgebieten. Unser Fokus liegt darauf, für Sie die bestmögliche Lösung zu finden, sei es außergerichtlich oder vor Gericht." },
            ]
        },
        kanzlei: {
            sections: [
                { type: 'pageHeader', title: "Unsere Kanzlei" },
                { type: 'textBlock', content: "Die Kanzlei [Firma] steht für langjährige Erfahrung und höchste juristische Qualität. Unser Team von spezialisierten Anwälten setzt sich mit Engagement und Fachwissen für die Belange unserer Mandanten ein." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontakt & Anfahrt" },
                { type: 'contactForm', title: "Schildern Sie uns Ihren Fall" },
            ]
        },
    }
  },
  fitness: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Erreiche deine Fitness-Ziele.", subtitle: "Bei [Firma] findest du die besten Kurse, Trainer und eine motivierende Community." },
                { 
                    type: 'services', 
                    title: "Unser Angebot",
                    items: [
                        { title: "Funktionelles Training", description: "Ganzkörper-Workouts, die dich fit für den Alltag machen.", icon: icons.sparkles },
                        { title: "Yoga & Pilates", description: "Finde deine Mitte und stärke deinen Körper mit unseren Kursen.", icon: icons.paintbrush },
                        { title: "Personal Training", description: "Individuelle Betreuung für maximale Erfolge und Motivation.", icon: icons.code },
                    ],
                },
                { type: 'cta', title: "Jetzt Probetraining vereinbaren!" },
            ]
        },
        kurse: {
             sections: [
                { type: 'pageHeader', title: "Unser Kursplan" },
                { type: 'textBlock', content: "Entdecke unser vielfältiges Kursangebot. Von hochintensivem Intervalltraining bis zu entspannendem Yoga – hier ist für jeden etwas dabei. Schau dir unseren aktuellen Kursplan an und finde deinen Lieblingskurs." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unser Studio & Team" },
                { type: 'textBlock', content: "Das [Firma] ist mehr als nur ein Fitnessstudio. Wir sind eine Gemeinschaft, die sich gegenseitig unterstützt und motiviert. Unsere zertifizierten Trainer helfen dir dabei, deine persönlichen Ziele zu erreichen." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Werde Mitglied" },
                { type: 'contactForm', title: "Fragen zur Mitgliedschaft?" },
            ]
        },
    }
  },
  coaching: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Entfalte dein volles Potenzial.", subtitle: "Mit maßgeschneidertem Coaching von [Firma] erreichen Sie Ihre persönlichen und beruflichen Ziele." },
                { 
                    type: 'services', 
                    title: "Meine Coaching-Schwerpunkte",
                    items: [
                        { title: "Karriere-Coaching", description: "Finden Sie berufliche Erfüllung und meistern Sie den nächsten Karriereschritt.", icon: icons.sparkles },
                        { title: "Leadership-Coaching", description: "Entwickeln Sie Ihre Führungskompetenzen und inspirieren Sie Ihr Team.", icon: icons.code },
                        { title: "Life-Coaching", description: "Schaffen Sie Klarheit, überwinden Sie Hindernisse und gestalten Sie Ihr Leben aktiv.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Kostenloses Erstgespräch anfordern" },
            ]
        },
        angebote: {
             sections: [
                { type: 'pageHeader', title: "Coaching-Angebote" },
                { type: 'textBlock', content: "Ich biete verschiedene Coaching-Formate an, die auf Ihre individuellen Bedürfnisse zugeschnitten sind. Ob Einzel-Coaching, Team-Workshops oder Online-Kurse – wir finden gemeinsam den richtigen Weg für Sie." },
            ]
        },
        übermich: {
            sections: [
                { type: 'pageHeader', title: "Über Mich" },
                { type: 'textBlock', content: "Als zertifizierter Coach bei [Firma] ist es meine Leidenschaft, Menschen dabei zu unterstützen, ihr Potenzial zu erkennen und zu nutzen. Mit Empathie, Struktur und bewährten Methoden begleite ich Sie auf Ihrem Weg zum Erfolg." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Starten Sie Ihre Reise" },
                { type: 'contactForm', title: "Unverbindliche Anfrage" },
            ]
        },
    }
  },
  reisebuero: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Unvergessliche Reisen. Perfekt geplant.", subtitle: "Mit [Firma] entdecken Sie die Welt – individuell und sorgenfrei." },
                { 
                    type: 'services', 
                    title: "Unsere Reisearten",
                    items: [
                        { title: "Pauschalreisen", description: "Entspannte Urlaube an den schönsten Stränden der Welt.", icon: icons.sun },
                        { title: "Individualreisen", description: "Maßgeschneiderte Abenteuer, die genau Ihren Wünschen entsprechen.", icon: icons.sparkles },
                        { title: "Kreuzfahrten", description: "Entdecken Sie mehrere Destinationen bequem von Ihrem schwimmenden Hotel aus.", icon: icons.code },
                    ],
                },
                { type: 'cta', title: "Finden Sie Ihre Traumreise" },
            ]
        },
        reisen: {
             sections: [
                { type: 'pageHeader', title: "Reiseangebote" },
                { type: 'textBlock', content: "Stöbern Sie durch unsere ausgewählten Reiseangebote. Egal ob Sie Entspannung, Abenteuer oder Kultur suchen, wir haben das passende Angebot für Sie. Lassen Sie sich inspirieren!" },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unsere Reiseexperten" },
                { type: 'textBlock', content: "Das Team von [Firma] besteht aus erfahrenen Reiseberatern, die mit Leidenschaft und Fachwissen Ihre Traumreise planen. Wir kennen die schönsten Orte und geben Ihnen wertvolle Insider-Tipps." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Reiseberatung" },
                { type: 'contactForm', title: "Lassen Sie sich beraten" },
            ]
        },
    }
  },
  eventagentur: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Wir schaffen Erlebnisse, die begeistern.", subtitle: "[Firma] ist Ihr Partner für unvergessliche Events – von der Konzeption bis zur Umsetzung." },
                { 
                    type: 'services', 
                    title: "Unsere Leistungen",
                    items: [
                        { title: "Corporate Events", description: "Professionelle Planung für Tagungen, Konferenzen und Firmenfeiern.", icon: icons.code },
                        { title: "Private Feiern", description: "Ob Hochzeit oder runder Geburtstag – wir machen Ihre Feier zu etwas Besonderem.", icon: icons.sparkles },
                        { title: "Messeauftritte", description: "Kreative Konzepte für einen Messestand, der aus der Masse heraussticht.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Planen Sie Ihr nächstes Event mit uns" },
            ]
        },
        portfolio: {
             sections: [
                { type: 'pageHeader', title: "Unsere Projekte" },
                { type: 'textBlock', content: "Sehen Sie sich eine Auswahl unserer erfolgreich umgesetzten Events an. Wir sind stolz auf unsere vielfältigen Projekte und die zufriedenen Kunden, die wir begeistern durften." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unsere Agentur" },
                { type: 'textBlock', content: "Mit Kreativität, Organisationstalent und Liebe zum Detail macht [Firma] jedes Event einzigartig. Wir sind ein Team von leidenschaftlichen Event-Managern, das Ihre Visionen Wirklichkeit werden lässt." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Event anfragen" },
                { type: 'contactForm', title: "Erzählen Sie uns von Ihrem Event" },
            ]
        },
    }
  },
  architekturbuero: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Architektur, die inspiriert und funktioniert.", subtitle: "[Firma] gestaltet Räume mit Vision und Nachhaltigkeit." },
                { 
                    type: 'services', 
                    title: "Unsere Kompetenzen",
                    items: [
                        { title: "Gebäudeplanung", description: "Von der ersten Skizze bis zum fertigen Bauantrag – wir planen Ihr Bauvorhaben.", icon: icons.paintbrush },
                        { title: "Innenarchitektur", description: "Funktionale und ästhetische Raumkonzepte, die Lebensqualität schaffen.", icon: icons.sparkles },
                        { title: "Bauleitung", description: "Wir überwachen die Umsetzung Ihres Projekts und sorgen für Qualität und Termintreue.", icon: icons.code },
                    ],
                },
                { type: 'cta', title: "Lassen Sie uns Ihr Projekt realisieren" },
            ]
        },
        projekte: {
             sections: [
                { type: 'pageHeader', title: "Unsere Projekte" },
                { type: 'textBlock', content: "Unser Portfolio umfasst eine breite Palette von Projekten, von privaten Wohnhäusern über Gewerbebauten bis hin zu öffentlichen Einrichtungen. Jedes Projekt ist ein Zeugnis unserer Leidenschaft für durchdachte Architektur." },
            ]
        },
        büro: {
            sections: [
                { type: 'pageHeader', title: "Unser Büro" },
                { type: 'textBlock', content: "Das Architekturbüro [Firma] wurde mit dem Ziel gegründet, anspruchsvolle und nachhaltige Architektur zu schaffen. Unser Team aus Architekten und Planern arbeitet interdisziplinär an innovativen Lösungen." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontakt" },
                { type: 'contactForm', title: "Wir freuen uns auf Ihre Projektanfrage" },
            ]
        },
    }
  },
  baeckerei: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Handwerk, das man schmeckt.", subtitle: "Täglich frische Backwaren aus Meisterhand bei [Firma]." },
                { 
                    type: 'products', 
                    title: "Unsere Spezialitäten",
                    items: [
                        { name: "Sauerteigbrot", price: "4,50 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Croissants", price: "1,80 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Schwarzwälder Kirschtorte", price: "3,50 € / Stück", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Belegte Brötchen", price: "ab 2,50 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
                { type: 'cta', title: "Besuchen Sie uns in der Backstube" },
            ]
        },
        sortiment: {
             sections: [
                { type: 'pageHeader', title: "Unser Sortiment" },
                { type: 'textBlock', content: "Von knusprigen Brötchen über saftige Brote bis hin zu feinsten Kuchen und Torten – unser Sortiment wird täglich frisch mit den besten Zutaten und traditionellen Rezepten hergestellt." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unsere Bäckerei" },
                { type: 'textBlock', content: "Die Bäckerei [Firma] ist ein Familienbetrieb in dritter Generation. Wir lieben unser Handwerk und backen mit Leidenschaft – und das schmeckt man." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Bestellung & Kontakt" },
                { type: 'contactForm', title: "Haben Sie eine Frage oder Bestellung?" },
            ]
        },
    }
  },
  friseursalon: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Ihr Haar in Meisterhand.", subtitle: "Willkommen bei [Firma], Ihrem Experten für Schnitt, Farbe und Styling." },
                { 
                    type: 'services', 
                    title: "Unsere Top-Leistungen",
                    items: [
                        { title: "Schnitt & Styling", description: "Moderne und klassische Haarschnitte für Damen, Herren und Kinder.", icon: icons.paintbrush },
                        { title: "Farbe & Strähnen", description: "Brillante Farben und kreative Techniken für Ihren individuellen Look.", icon: icons.sparkles },
                        { title: "Hochsteckfrisuren", description: "Elegante Frisuren für besondere Anlässe wie Hochzeiten und Bälle.", icon: icons.code },
                    ],
                },
                { type: 'cta', title: "Buchen Sie Ihren Termin online" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Preise & Leistungen" },
                { type: 'textBlock', content: "Entdecken Sie unsere vollständige Preisliste für alle Friseurdienstleistungen. Wir beraten Sie gerne persönlich, um den perfekten Look für Sie zu finden." },
            ]
        },
        team: {
            sections: [
                { type: 'pageHeader', title: "Unser Team" },
                { type: 'textBlock', content: "Unser Team aus top-geschulten und kreativen Stylisten freut sich darauf, Ihre Haarwünsche zu erfüllen. Wir bilden uns ständig weiter, um Ihnen die neuesten Trends und Techniken anbieten zu können." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Termin buchen" },
                { type: 'contactForm', title: "Wir freuen uns auf Sie" },
            ]
        },
    }
  },
  versicherung: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Sicherheit für alles, was Ihnen wichtig ist.", subtitle: "Ihre [Firma] Agentur – Ihr verlässlicher Partner für Versicherungen und Vorsorge." },
                { 
                    type: 'services', 
                    title: "Unsere Beratungsfelder",
                    items: [
                        { title: "Privatvorsorge", description: "Sichern Sie Ihre Zukunft ab – von der Rente bis zur Berufsunfähigkeit.", icon: icons.sparkles },
                        { title: "Sachversicherungen", description: "Schützen Sie Ihr Eigentum, vom Hausrat bis zum Auto.", icon: icons.code },
                        { title: "Gewerbeversicherung", description: "Maßgeschneiderte Lösungen für Selbstständige und Unternehmen.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Lassen Sie sich unverbindlich beraten" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Versicherungen im Überblick" },
                { type: 'textBlock', content: "Wir bieten Ihnen ein breites Portfolio an Versicherungsprodukten namhafter Anbieter. Gemeinsam finden wir die Absicherung, die perfekt zu Ihrer Lebenssituation passt." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Ihre Agentur vor Ort" },
                { type: 'textBlock', content: "Bei [Firma] stehen Sie als Mensch im Mittelpunkt. Wir legen Wert auf eine persönliche, verständliche und ehrliche Beratung. Ihr Vertrauen ist unser höchstes Gut." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Beratungstermin" },
                { type: 'contactForm', title: "Fordern Sie eine Beratung an" },
            ]
        },
    }
  },
  reinigung: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Glänzende Sauberkeit, auf die Sie sich verlassen können.", subtitle: "[Firma] ist Ihr professioneller Partner für Gebäudereinigung." },
                { 
                    type: 'services', 
                    title: "Unsere Dienstleistungen",
                    items: [
                        { title: "Büroreinigung", description: "Ein sauberes Arbeitsumfeld für motivierte Mitarbeiter und einen guten Eindruck.", icon: icons.code },
                        { title: "Gebäudereinigung", description: "Umfassende Reinigung und Pflege für den Werterhalt Ihrer Immobilie.", icon: icons.sparkles },
                        { title: "Glas- & Fassadenreinigung", description: "Streifenfreier Glanz und ein sauberes Erscheinungsbild für Ihr Gebäude.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Fordern Sie ein kostenloses Angebot an" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Unser Serviceangebot" },
                { type: 'textBlock', content: "Wir bieten flexible und zuverlässige Reinigungslösungen für Unternehmen und Privatkunden. Unser geschultes Personal arbeitet mit modernen Geräten und umweltfreundlichen Reinigungsmitteln." },
            ]
        },
        überuns: {
            sections: [
                { type: 'pageHeader', title: "Unser Unternehmen" },
                { type: 'textBlock', content: "[Firma] steht für höchste Qualitätsstandards und Zuverlässigkeit in der Gebäudereinigung. Kundenzufriedenheit ist unser oberstes Ziel. Wir sind Ihr flexibler und fairer Partner." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Angebot anfordern" },
                { type: 'contactForm', title: "Wir erstellen Ihr individuelles Angebot" },
            ]
        },
    }
  },
  musikschule: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Entdecke die Musik in dir.", subtitle: "In der Musikschule [Firma] lernst du dein Lieblingsinstrument mit Freude und Erfolg." },
                { 
                    type: 'services', 
                    title: "Unser Unterrichtsangebot",
                    items: [
                        { title: "Gitarrenunterricht", description: "Von Klassik bis Rock – lerne die Gitarre in all ihren Facetten.", icon: icons.code },
                        { title: "Klavierunterricht", description: "Der Einstieg in die Welt der Tasten für Anfänger und Fortgeschrittene.", icon: icons.sparkles },
                        { title: "Gesangsunterricht", description: "Entdecke deine Stimme und lerne die richtige Technik bei unseren Vocal Coaches.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Jetzt zur Probestunde anmelden" },
            ]
        },
        unterricht: {
             sections: [
                { type: 'pageHeader', title: "Instrumente & Kurse" },
                { type: 'textBlock', content: "Wir bieten qualifizierten Einzel- und Gruppenunterricht für eine Vielzahl von Instrumenten. Unser pädagogisches Konzept ist modern und geht auf die individuellen Wünsche und Ziele jedes Schülers ein." },
            ]
        },
        lehrer: {
            sections: [
                { type: 'pageHeader', title: "Unsere Lehrkräfte" },
                { type: 'textBlock', content: "Unser Team besteht aus erfahrenen und sympathischen Musikpädagogen, die selbst aktive Musiker sind. Sie unterrichten mit viel Engagement und Freude an der Musik." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Anmeldung & Kontakt" },
                { type: 'contactForm', title: "Wir beraten Sie gerne" },
            ]
        },
    }
  },
  tierarzt: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Für die Gesundheit Ihres Lieblings.", subtitle: "Ihre Tierarztpraxis [Firma] – moderne Tiermedizin mit Herz und Verstand." },
                { 
                    type: 'services', 
                    title: "Unsere Leistungen",
                    items: [
                        { title: "Vorsorge & Impfungen", description: "Regelmäßige Check-ups für ein langes und gesundes Tierleben.", icon: icons.sparkles },
                        { title: "Chirurgie", description: "Weichteilchirurgie in unserer modern ausgestatteten Praxis.", icon: icons.code },
                        { title: "Zahnbehandlung", description: "Professionelle Zahnreinigung und -behandlung für Hund und Katze.", icon: icons.paintbrush },
                    ],
                },
                { type: 'cta', title: "Vereinbaren Sie einen Termin für Ihr Tier" },
            ]
        },
        leistungen: {
             sections: [
                { type: 'pageHeader', title: "Unser Leistungsspektrum" },
                { type: 'textBlock', content: "Von der allgemeinen Sprechstunde über digitales Röntgen bis hin zum hauseigenen Labor bieten wir eine umfassende medizinische Versorgung für Ihr Haustier. Das Wohl unserer Patienten steht dabei immer an erster Stelle." },
            ]
        },
        team: {
            sections: [
                { type: 'pageHeader', title: "Unser Praxisteam" },
                { type: 'textBlock', content: "In der Praxis [Firma] kümmert sich ein Team von erfahrenen Tierärzten und tiermedizinischen Fachangestellten liebevoll um Ihr Tier. Wir nehmen uns Zeit für eine gründliche Untersuchung und Beratung." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Sprechzeiten & Notfall" },
                { type: 'contactForm', title: "Terminanfrage" },
            ]
        },
    }
  },
  buchhandlung: {
    pages: {
        home: {
            sections: [
                { type: 'hero', title: "Die Welt der Bücher erwartet Sie.", subtitle: "Ihre Buchhandlung [Firma] – mit Liebe ausgewählte Bücher und persönliche Beratung." },
                { 
                    type: 'products', 
                    title: "Unsere Empfehlungen",
                    items: [
                        { name: "Spannender Bestseller", price: "24,00 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Zauberhaftes Kinderbuch", price: "15,00 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Inspirierendes Sachbuch", price: "28,00 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                        { name: "Neuer Roman", price: "22,00 €", imageUrl: '/assets/images/placeholder-1-1.png' },
                    ],
                },
                { type: 'cta', title: "Stöbern Sie in unserem Online-Shop" },
            ]
        },
        shop: {
             sections: [
                { type: 'pageHeader', title: "Unser Online-Shop" },
                { type: 'textBlock', content: "Finden Sie Ihr nächstes Lieblingsbuch bequem von zu Hause aus. Wir versenden schnell und zuverlässig oder Sie können Ihre Bestellung bei uns im Laden abholen." },
            ]
        },
        empfehlungen: {
            sections: [
                { type: 'pageHeader', title: "Unsere Empfehlungen" },
                { type: 'textBlock', content: "Das Team von [Firma] liest mit Leidenschaft und teilt gerne seine persönlichen Lese-Highlights mit Ihnen. Entdecken Sie neue Autoren und unentdeckte Schätze." },
            ]
        },
        kontakt: {
            sections: [
                { type: 'pageHeader', title: "Kontakt & Öffnungszeiten" },
                { type: 'contactForm', title: "Fragen oder Buchbestellung?" },
            ]
        },
    }
  },
  default: defaultContent,
};