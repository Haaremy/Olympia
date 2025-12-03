import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function gameEntries() {
  const game1 = await prisma.game.create({
    data: {
      url: 'https://www.youtube.com/embed/709ZC7t-8RU',
      tagged: "hidden,overridePlayers,mapPosx860mapPosx,mapPosy250mapPosy",
      languages: {
        create: [
          {
            language: 'de',   // Deutsche Version
            title: 'Bäckerei',
            story: 'Es ist der erste Tag im Dezember und das Haus riecht noch nicht nach Keksen, Stollen und Gewürzen? Na wie auch, wenn keiner die Behälter beschriftet und die Gewürze zum Ratespiel werden. Wir wissen zwar noch welche wir irgendwann mal hatten, aber nicht mehr welche noch da sind.',
            station: 'Obergeschoss 1 - Foyer',
            capacity: 'Mehrere Teams',
            descriptionGame: 'Auf dem Tisch stehen 4 Gewürze (#1 - #4). Davor liegen mögliche Beschriftungen (1 - 20) der Behälter. Besprecht euch im Team, welche Beschriftung zu welchem Behälter passt.',
            descriptionPoints: 'Tragt im entsprechenden #Feld die Lösungszahl der Beschriftung ein.'
          },
          {
            language: 'en',   // Englische Version
            title: 'Bakery',
            story: 'It\'s the first day of December and the house doesn\'t smell of cookies, fruitcake and spices yet? Well, how could it be? Nobody labelled the spice containers and now it\'s a guessing game! We remember which ones we bought, but not which ones we still have.',
            station: 'First Floor – Foyer',
            capacity: 'Multiple Teams',
            descriptionGame: 'There are 4 spices on the table (#1 - #4), and 20 possible labels for the containers. Discuss as a team which label (1 - 20) goes with which container.',
            descriptionPoints: 'Enter the number of the label in the corresponding #field.'
          }
        ]
      }
    }
  });


const game2 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/t5hXlxVnxfo',
    tagged: "hidden,overridePlayers",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Passwort vergessen?',
          story: 'Die Wunschliste wurde vor ein paar Jahren digitalisiert. Alle Briefe an den Nordpol werden gescannt und mit der Datenbank von Gut und Böse abgeglichen. Daraufhin wird der Wunsch auf die Liste gepackt. Beim Abrufen der diesjährigen Liste kann sich der Weihnachtsmann nicht mehr an sein Passwort erinnern, aber hat sich eine Erinnerung geschrieben.',
          station: 'Obergeschoss 1 - Foyer',
          capacity: 'Multiple Teams',
          descriptionGame: 'Vor euch liegen Buchstaben und ihr müsst damit die 4 Wort-Kästchen (gedanklich) ausfüllen. Hierfür habt ihr wie bei einem Kreuzworträtsel Hinweise neben den Kästchen. Besprecht euch im Team.',
          descriptionPoints: 'Die Buchstaben haben Zahlwerte (A = 1; B = 2; ...; Z = 26). Tragt den Zahlenwert in das entsprechende #Feld ein, auf dem der Buchstabe liegt.'
        },
        {
          language: 'en',
          title: 'Forgot your password?',
          story: 'Santa’s wishlist was digitized a few years ago. All letters to the North Pole are scanned and cross-referenced with the Naughty and Nice database. The wish is then added to the list. When retrieving this year´s list, Santa can no longer remember his password! Luckily, he has left himself a clue.',
          station: 'First Floor – Foyer',
          capacity: 'Multiple teams',
          descriptionGame: 'There are letters in front of you and you have to fill in the 4 word-boxes (in your head). There are clues next to the boxes, just like in a crossword puzzle. Discuss as a team.',
          descriptionPoints: 'The letters have numerical values. Enter the numerical value in the corresponding #field of the letter.'
        }
      ]
    }
  }
});


const game3 = await prisma.game.create({
  data: {
    url: '',
    tagged: "overridePlayers,hidden",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Computerfehler',
          story: 'Der Weihnachtsmann sieht, hört und weiß alles. Immer und bei allem, was wir machen, dokumentiert er, ob wir gut oder böse waren. Spielen, Lachen und Streiten bei Tag und Nacht. Alles wird auf seinem Computer gespeichert, aber leider ist etwas beim Speichern schief gelaufen.',
          station: 'Erdgeschoss - Raum 110',
          capacity: '1 Team',
          descriptionGame: 'Auf dem Tisch liegen vier Suchrätsel. In jedem Suchrätsel werden Wörter vorgegeben, die ihr finden müsst. Eines der Wörter ist jedoch nicht im Buchstabensalat zu finden.',
          descriptionPoints: 'Sucht nach dem Wort, was nicht im Buchstabensalat zu finden ist und tragt dessen Lösungszahl in das entsprechende #Feld ein.'
        },
        {
          language: "en",
          title: "Computer Error",
          story: "Santa Claus sees, hears, and knows everything. All the time and for everything we do, he records whether we have been good or bad. Playing, laughing, and arguing day and night. Everything is stored on his computer, but something went wrong duriong saving.",
          station: "Ground Floor - Room 110",
          capacity: "1 Team",
          descriptionGame: "On the table are four word search puzzles. In each puzzle, words are given that you must find. However, one of the words cannot be found in the word search.",
          descriptionPoints: "Find the word that cannot be found in the word search and enter its solution number in the corresponding #field."
        }

      ]
    }
  }
});


const game4 = await prisma.game.create({
  data: {
    url: '',
    tagged: "overridePlayers,hidden",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Schnitzeljagd',
          story: "'Junior Geschenke Spezialist' benötigt ein Studium und 10 Jahre Berufserfsahrung. Im X-ErasMAS+ Program werden Schüler von den verschiedenen Ausbildungsstätten kulturell geschult. Für einige ist das eine große Umstellung, insbesondere für die Osterhasen. Die Geschenke werden gar nicht versteckt?",
          station: 'Fachbereich INS',
          capacity: 'Multiple Teams',
          descriptionGame: 'Folge den Hinweisen: <br />Rätsel <br /><br />#1: Sucht den Ort, wo der Duft von Speisen durch die Luft zieht und Gemeinschaft am Tisch entsteht.<br /><br />#2: Geht dorthin, wo jeder seinen Weg durch das Geäude beginnt.<br /><br />#3: Sucht dort, wo flackernde Bilder ein warmes Feuer vorgaukeln  <br /><br />#4: Sucht den Raum, wo die Realität vor einer grünen Wand verschwindet und kreative Welten entstehen.',
          descriptionPoints: 'Tragt im entsprechenden #Feld die Lösungszahl der Beschriftung ein.'
        },
        {
          language: 'en',
          title: 'Paper Chase',
          story: "Junior Gift Specialist requires a degree and 10 years of professional experience. In the X-ErasMAS+ Program, students from various educational institutions receive cultural training. For some, this is a big change, especially for the Easter bunnies. What do you mean, the presents are not hidden at all?",
          station: 'INS Department',
          capacity: 'Multiple teams',
          descriptionGame: 'Follow the hints: <br />Riddle <br /><br />#1: Look for the place where the aroma of food fills the air and fellowship is built around the table.<br /><br />#2: Go to where everyone starts their journey through the building.<br /><br />#3: Look for places where flickering images create the illusion of a warm fire.<br /><br />#4: Seek out the space where reality disappears in front of a green screen and creative worlds emerge.',
          descriptionPoints: 'Each item has a #number and an answer number. Enter the numbers in the #field as soon as you have them all.'
        }
      ]
    }
  }
});


const game5 = await prisma.game.create({ 
  data: {
    url: 'https://www.youtube.com/embed/8Gcw61fFrD4',
    
    languages: {
      create: [
        {
          language: 'de',
          title: 'Verpackung',
          story: 'Der Geschenke Bondage-Kurs ist ein Modul an der Santa-Universität. Prüfungsleistung ist es, alle Geschenke in der Zeit mit einer Schleife zu versehen.',
          station: 'Erdgeschoss 1 - Raum 110',
          capacity: '1 Team',
          descriptionGame: 'Jedes Mitglied sucht sich 1 Gegenstand aus. Ihr stoppt die Zeit für 30 Sekunden. Anschließend wird die Schleife wieder entfernt.',
          descriptionPoints: 'Jeder Spieler mit einer Schleife (die hält), trägt in sein #Feld eine 1 ein.'
        },
        {
          language: 'en',
          title: 'Wrapping',
          story: 'The Gift Wrapping Bondage Course is a module at Santa University. The final exam is to tie a bow around each gift within the time limit.',
          station: 'First Floor – Room 110',
          capacity: '1 Team',
          descriptionGame: 'Each team member selects one item. Time is stopped for 30 seconds while they tie a bow. Then, the bows are removed again.',
          descriptionPoints: 'Each player with a bow that holds enters a 1 in their #field.'
        }
      ]
    }
  }
});


const game6 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/YyZ09UlBV94',
    tagged:":unit:Treffer:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Mini-Curling',
          story: 'Die Elfen des Weihnachtsmannes haben deinen Wunsch gelesen und der Gewerkschaft gemeldet. 5 Curlingsteine?! Der Sack des Weihnachtsmannes ist zwar magisch, aber die armen Elfen müssen auf ihre Gesundheit achten. Sie schenken dir gütiger Weise eines ihrer Curling-Sets. Das ist zwar nicht ganz so groß, wie ein normales, aber macht dennoch großen Spaß. Einen Besen brauchst du dafür auch nicht.',
          station: 'Erdgeschoss - Flur Westflügel',
          capacity: 'Solo Team',
          descriptionGame: 'Jeder Spieler hat 5 Schuss und es wird nacheinander gespielt. Der Spieler stellt oder hockt sich vor die Markierung und versucht, den Kreis zu treffen, indem er den Puck über den Boden schiebt.',
          descriptionPoints: 'Jeder Treffer im äußeren Kreis sind 1 Punkt, der innere Kreis gibt 2 Punkte. Rechnet eure Punkte zusammen und tragt Sie in euer #Feld ein.'
        },
        {
          language: 'en',
          title: 'Mini Curling',
          story: 'Santa\'s elves have read your wishlist and passed it on to the Union. 5 curling stones?! Santa\'s sack may be magical, but the poor elves have to watch out for their health. They kindly give you one of their curling sets. It\'s not quite as big as a normal one, but it\'s still great fun. You don\'t need a broom for this either.',
          station: 'Ground Floor – West wing corridor',
          capacity: 'Solo Team',
          descriptionGame: 'Each player has 5 shots and the game is played in succession. The player kneels or crouches in front of the mark and tries to hit the circle by sliding the puck along the floor.',
          descriptionPoints: 'Each hit in the outer circle is worth 1 point, the inner circle is worth 2 points. Add up your points and enter them in your #field.'
        }
      ]
    }
  }
});


const game7 = await prisma.game.create({
  data: {
    url: '',
    tagged:":unit:sec:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Schneeball-Spur',
          story: 'Am Nordpol schon mal Hühner gesehen? Nein? Liegt vielleicht daran, dass es keine gibt. Entsprechend gibt es auch kein Frühstücksei und noch weniger Eier für Spiele. Die Elfen haben beim Austauschprogramm zur Osterhasen-Schule Eierlauf kennengelernt und jetzt für sich entdeckt.',
          station: 'Obergeschoss 1 - Flur Westflügel',
          capacity: '1 bis 2 Teams',
          descriptionGame: 'Jeder Spieler hat einen Versuch. Währenddessen stoppt einer die Zeit. Folgt dem Parkour entlang der Pfeile.',
          descriptionPoints: 'Trag den Zeitwert des Spielers in Sekunden in das entsprechende #Feld.'
        },
        {
          language: 'en',
          title: 'Snowball Run',
          story: 'Ever seen chickens at the North Pole? No? Maybe it\'s because there aren\'t any. So no eggs for breakfast, and even fewer eggs for games. The elves discovered the egg-and-spoon race during the exchange program at the Easter Bunny School and have now taken a liking to it.',
          station: 'First Floor – West wing corridor',
          capacity: '1 to 2 teams',
          descriptionGame: 'Each player has one attempt. Meanwhile, someone stops the time.',
          descriptionPoints: 'Enter the player\'s time value in seconds in the corresponding #field.'
        }
      ]
    }
  }
});


const game8 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/ucl7HeabPO0',
    tagged: "hidden,overridePlayers",
    languages: {
      create: [
        {
          language: 'de',
          title: '.. 22, 23, 24, ..',
          story: 'Die Gewerkschaft der Elfen hat feste Regelungen, unter anderem zu den Pausenzeiten und den Vergütungen. Jedem Elf stehen bei einem 24 Stunden Arbeitstag 24 Pausen zu. In jeder Pause müssen sie Zugang zu Snacks haben. Da der Weihnachtsmann gar nicht mehr weiß, wie viele über sind, müsst ihr schätzen.',
          station: 'Erdgeschoss - Foyer',
          capacity: 'Multiple Teams',
          descriptionGame: 'Schätzt die Anzahl der Süßigkeiten.',
          descriptionPoints: 'Tragt in das jeweilige #Feld die Schätzung ein.'
        },
        {
          language: 'en',
          title: '... 22, 23, 24, ...',
          story: 'The Elf Union has established strict regulations, including rules for break times and compensation. Every elf is entitled to 24 breaks in a 24-hour working day. During every break, they must have access to snacks. Since Santa doesn\'t even know how many are left, you\'ll have to guess.',
          station: 'Ground Floor – Foyer',
          capacity: 'Multiple teams',
          descriptionGame: 'Estimate the number of sweets.',
          descriptionPoints: 'Enter the estimate in the respective #field.'
        }
      ]
    }
  }
});


const game9 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/sKCM5yMr4Js',
    tagged:":unit:Treffer:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Schlacht der Elfen',
          story: 'Kokosmakronen sind die Besten! - Nein, Vanille-Kipferl! : Die Elfen haben sich in 2 Parteien gespalten, was die besten Kekse sind und bekriegen sich nun mit Schneebällen (hoffentlich ohne Steine).',
          station: 'Obergeschoss 1 - Foyer',
          capacity: '1 Team',
          descriptionGame: 'Jeder Spieler hat 5 Würfe. Ihr werft auf die Wichtel/Elfen auf dem Tisch. Nach der Runde wird für den nächsten Spieler aufgebaut.',
          descriptionPoints: 'Tragt die Anzahl der umgeworfenen Wichtel euer entsprechendes #Feld.'
        },
        {
          language: 'en',
          title: 'Battle of the Elves',
          story: 'Coconut macaroons are the best! – No, vanilla crescents! The elves have split into two parties over which are the best cookies and are now fighting each other with snowballs (hopefully without stones).',
          station: 'First Floor - Foyer',
          capacity: '1 Team',
          descriptionGame: 'Each player has 5 throws. You throw at the cans on the table (elves). After the round, the game is set up for the next player.',
          descriptionPoints: 'Enter the number of cans that have fallen off the table in the corresponding #field.'
        }
      ]
    }
  }
});


const game10 = await prisma.game.create({
  data: {
    url: '',
    tagged: "hidden,overridePlayers",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Wettbacken',
          story: 'Nicht nur am Nordpol ist die Debatte um die beste Kekssorte ein heißes Thema. Auch in unseren Küchen werden sie zum Gespräch (auch wenn Vanille Kipferle objektiv die besten sind).',
          station: 'Erdgeschoss - Raum 110',
          capacity: 'Multiple Teams',
          descriptionGame: 'Vier Freunde – Elias(#1), Fiona(#2), Greta(#3) und Hannes(#4) – backen Kekse für Weihnachten. Jeder von ihnen hat einen anderen Keksfavoriten: Lebkuchen (1), Zimtsterne (2), Vanillekipferl (3) oder Spekulatius (4). Außerdem backt jeder eine andere Anzahl an Keksen (5, 6, 7 oder 9). Findet heraus, wer welchen Keks mag und wie viele Kekse jede Person gebacken hat, basierend auf den folgenden Hinweise: Findet ihr an der Station.',
          descriptionPoints: "Tragt in jedes #Feld die Anzahl der Kekse mit der Zahl (ID) des Kekses (bspw 2 Zimtstern (9) = 29) ein."
        },
        {
          language: 'en',
          title: 'Baking Competition',
          story: "It is not only at the North Pole that the debate about the best type of cookie is a hot topic. Even in our kitchens, they become a topic of conversation (even though vanilla crescents are objectively the best).",
          station: 'Ground Floor - Room 110',
          capacity: 'Multiple teams',
          descriptionGame: "Four friends - Elias(#1), Fiona(#2), Greta(#3) and Hannes(#4) - bake cookies for Christmas. Each of them has a different cookie favorite: gingerbread (1), cinnamon stars (2), vanilla crescents (3) or speculoos (4). In addition, everyone bakes a different number of cookies (5, 6, 7 or 9). Find out who likes which cookie and how many cookies each person has baked based on the following clues: Find them at the station.",
          descriptionPoints: "Enter into every #field the number of cookies with the number (id) of the cookie (e.g. 2 cinnamon stars (9) = 29)."
        }
      ]
    }
  }
});


const game11 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/fZ_udkVJbec',
    tagged:":unit:Punkte:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Zielen und Feuer',
          story: 'Eigentlich wollten sie Boccia spielen, aber die Elfen hatten kein verschiedenfarbigen Schnee und den gelben wollte keiner anfassen. Jetzt haben sie gelbe Markierungen in den Schnee gemalt und versuchen sich an Zielwerfen.',
          station: 'Obergeschoss 1 - Foyer',
          capacity: '1 Team',
          descriptionGame: 'Jeder Spieler hat 3 Versuche. Die Summe der Trefferpunkte wird eingetragen.',
          descriptionPoints: "Tragt die Summe der Zahlen aus den Versuchen in euer #Feld ein."
        },
        {
          language: 'en',
          title: 'Aim and Fire',
          story: "They actually wanted to play bocce, but the elves didn’t have snow in different colors, and no one wanted to touch the yellow one. Now they have drawn yellow markings in the snow and are trying their hand at target throwing.",
          station: 'First Floor – Foyer',
          capacity: '1 Team',
          descriptionGame: 'Each player has 3 attempts. The sum of the numbers thrown is scored.',
          descriptionPoints: "Enter the sum of the numbers from the attempts in your #Feld."
        }
      ]
    }
  }
});


const game12 = await prisma.game.create({
  data: {
    url: 'https://www.youtube.com/embed/koXin1tVOHs',
    tagged:":unit:Treffer:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'X-Mas Bowling',
          story: 'Hast du dich schon mal klein gefühlt? Dann schätze doch, wie es für einen Elfen sein muss!! Jeden Tag müssen sie Spielzeug herstellen, dass teilweise größer ist, als sie selbst. Zudem müssen auch alle Spielzeuge den Spieletest durchlaufen, wodurch Bowling ganz neue Ausmaße bekommt. Die Kugel ist zudem viel zu schwer, aber dafür haben sie einen Trick.',
          station: 'Erdgeschoss - Raum 107',
          capacity: 'Solo Team',
          descriptionGame: 'Jeder Spieler hat 2 Würfe. Der Spieler stellt sich vor die Markierung und wirf die Weihnachtsbaum-Kugel. Die Kugel muss dabei so viele Kegel umwerfen wie möglich. Nach den 2 Würfen wird das Feld für den nächsten Spieler wieder aufgestellt.',
          descriptionPoints: "Strike (alle im 1. Wurf): 10 Punkte, Spare (alle im 2. Wurf): 8 Punkte, Ansonsten 1 Punkt pro Kegel. Tragt die Punktzahl in euer #Feld ein."
        },
        {
          language: 'en',
          title: 'X-Mas Bowling',
          story: 'Have you ever felt small? Then guess what it must be like for an elf! Every day they have to make toys that are sometimes bigger than they are. In addition, all toys have to pass the play test, which takes bowling to a whole new level. The ball is also far too heavy, but they have a trick for that.',
          station: 'First Floor  - Room 107',
          capacity: 'Solo Team',
          descriptionGame: 'Each player has 2 throws. The player stands in front of the mark and throws the Christmas tree ornament. The ball must knock over as many pins as possible. After the 2 throws, the pins are set up again for the next player.',
          descriptionPoints: "Strike (all in the 1st  throw): 10 points; spare (all in the 2nd  throw): 8 points; otherwise 1 point per pin. Note your points into your #Feld."
        }
      ]
    }
  }
});


const game13 = await prisma.game.create({
  data: {
    url: '',
    tagged: "hidden,overridePlayers",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Bilderrätsel',
          story: 'Qualität steht am Nordpol im Gesetz. Alle Spielzeuge für Groß und Klein müssen sicher sein. Kleinste Makel können schwere Schäden verursachen. Zur Übung wird schon im Elfen-Kindergarten trainiert.',
          station: 'Erdgeschoss - Foyer',
          capacity: 'Multiple Teams',
          descriptionGame: 'Vor euch liegen #4 Bilder. Jedes Bild hat Makel zu seinem Kontrollbild daneben. Tipp: macht euch Fotos der Bilder und besprecht euch im Team.',
          descriptionPoints: "Zählt die Makel und tragt sie im entsprechenden #Feld ein."
        },
        {
          language: 'en',
          title: 'Hawk Eye',
          story: 'Quality is the law at the North Pole. All toys for young and old must be safe. The smallest blemishes can cause serious damage. The elves are already practicing in kindergarten.',
          station: 'Ground Floor - Foyer',
          capacity: 'Multiple teams',
          descriptionGame: 'In front of you are #4 pictures. Each image has imperfections compared to its reference image next to it. Tip: take photos of the images and discuss them as a team.',
          descriptionPoints: "Count the imperfections and enter them in the corresponding #Feld."
        }
      ]
    }
  }
});


const game14 = await prisma.game.create({
  data: {
    url: '',
    tagged:"overridePlayers,hidden",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Gutes Kind, böses Kind',
          story: 'In den Supermärkten und Einkaufszentren der Erde trifft man häufig auf die gesandten Helfer des Weihnachtsmannes. Auch wenn der Weihnachtsmann alles sieht, hört und weiß, hat er sich hin und wieder eine Auszeit verdient und braucht besonders in der Hochsaison Helfer, die die Wünsche und Geschichten der Kinder anhören und bewerten. Die Kinder erzählen den Helfern vielerlei Geschichten, und damit diese die Kinder besser einschätzen können, werden sie mit Fragen geschult, um Lügen und Wahrheiten zu erkennen.',
          station: 'Erdgeschoss 1 - Foyer',
          capacity: 'Mehrere Teams',
          descriptionGame: 'Auf dem Tisch liegen Fakten und Lügen. Prüft diese mit eurer Einschätzung.',
          descriptionPoints: "In jeder Aussage ist eine Zahl enthalten. Tragt die Zahl der wahren Aussage in das entsprechende Feld ein."
        },
        {
          language: 'en',
          title: 'Good Kid, Bad Kid',
          story: 'In the supermarkets and shopping malls of the world, one often encounters Santa’s appointed helpers. Even though Santa sees, hears, and knows everything, he deserves a break from time to time and especially needs helpers during the busy season who listen to and assess the wishes and stories of children. The children tell the helpers many different stories, and to help them better evaluate the children, they are trained to recognize lies and truths through specific questions.',
          station: 'First Floor - Foyer',
          capacity: 'Multiple Teams',
          descriptionGame: 'On the table are facts and lies. Examine them using your best judgment.',
          descriptionPoints: "Every Text contains a number. Submit the number of the true text in its corresponding field."
        }
      ]
    }
  }
});


const game15 = await prisma.game.create({
  data: {
    url: '',
    tagged:":unit:Zuckerstangen:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Eisangler',
          story: 'Der Weihnachtsmann mag es entspannt. In seiner begrenzten Freizeit geht er auf den gefrorenen See, schneidet ein Loch hinein und angelt. Eisfischen ist zwar kalt, aber was alles in den verborgenen Seen des Nordpols schwimmt, davon kann man hier nur träumen.',
          station: 'Erdgeschoss - Raum 109',
          capacity: '1 Team',
          descriptionGame: 'Startet einen Timer für 30 Sekunden und versucht mit euren Angeln die Zuckerstangen aus dem Pool zu fischen.',
          descriptionPoints: "Jeder trägt sich die gefangenen Zuckerstangen in sein #Feld ein."
        },
        {
          language: 'en',
          title: 'Ice Fishing',
          story: 'Santa likes it relaxed. In his limited free time, he goes to the frozen lake, cuts a hole and goes fishing. Ice fishing may be cold, but you can only dream of what swims in the hidden lakes of the North Pole.',
          station: 'Ground Floor - Room 109',
          capacity: '1 Team',
          descriptionGame: 'Start a timer for 30 seconds and try to fish the candy canes out of the pool with your fishing rods.',
          descriptionPoints: "Everyone enters the candy canes they have caught in their #field."
        }
      ]
    }
  }
});

const game16 = await prisma.game.create({
  data: {
    url: '',
    tagged: ":unit:Etagen:unit:",
    languages: {
      create: [
        {
          language: 'de',
          title: 'Kalter Turm von Pisa',
          story: 'Überall bauen Kinder hübsch verzierte Lebkuchenhäuser, aber die sind hier ja standard. Am Nordpol bauen wir Schneeball-Türme und versuchen damit so hoch zu kommen wie es geht.',
          station: 'Obergeschoss 1 - Raum 216',
          capacity: 'Multiple Teams',
          descriptionGame: 'Ihr benötigt einen Timer. Jeder Spieler baut einen Turm aus Stoff-Schneebällen. Das Spiel ist nach 1 Minute beendet.',
          descriptionPoints: "Tragt die Anzahl der Ball-Etagen in euer jeweiliges #Feld."
        },
        {
          language: 'en',
          title: 'Cold Tower of Pisa',
          story: 'Children everywhere make beautifully decorated gingerbread houses, but here they are standard. At the North Pole, we build snowball towers and try to get as high as we can.',
          station: 'First Floor – Room 216',
          capacity: 'Multiple teams',
          descriptionGame: 'Each player builds a snowball tower. You always stack 1 on top of another. Start a 1 minute Timer. The game is over when the timer runs out.',
          descriptionPoints: "Enter the number of ball layers in your respective #field."
        }
      ]
    }
  }
});


const game17 = await prisma.game.create({
    data: {
      url: 'https://www.youtube.com/embed/M6CUG7MWq30',
      tagged:":unit:Punkte:unit:",
      languages: {
        create: [
          {
            language: 'de',   // Deutsche Version
            title: 'Eishockey',
            story: 'Unser lieblings Eishockeyteam die \'INS-ICE-Pythons\' haben uns ihre geheimen Trainingstipps verraten. Wir nutzen die Gelegenheit und teilen unser Wissen mit euch (natürlich mit Erlaubnis). An den Weihnachtsfeiertagen haben wir dann ein wichtiges Spiel gegen die Nordpolar-Bären.',
            station: 'Obergeschoss - Westflügel',
            capacity: '2 Teams',
            descriptionGame: 'Vor euch ist ein Tor aufgebaut vor dem Hindernisse stehen. Stellt euch in die Startmarkierung und schießt auf das Tor. Jeder Schießt 5 Mal.',
            descriptionPoints: 'Das vordere Tor gibt 1 Punkt, das hintere 2 Punkte. Tragt eure Punktzahl in euer #Feld ein.'
          },
          {
            language: 'en',   // Englische Version
            title: 'Ice hockey',
            story: 'Our favorite ice hockey team, the "INS ICE Pythons", have revealed their hidden training tips. We take the opportunity to share our knowledge with you (with permission, of course). We then have an important game against the North Polar Bears over the Christmas break.',
            station: 'First Floor - Westwing',
            capacity: '2 teams',
            descriptionGame: 'A goal is set up in front of you, with obstacles in the way. Stand at the starting mark and shoot at the goal. Everyone shoots 5 times.',
            descriptionPoints: 'Enter your number of hits in your #field.',
          }
        ]
      }
    }
  });


const game18 = await prisma.game.create({
    data: {
        url: '',
        tagged:"overridePlayers,hidden",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Wunschlos?',
                    story: 'Der Weihnachtsmann erfüllt jedes Jahr Millionen von Wünschen. Doch, was passiert, wenn ein Kind keine Wünsche äußert? Es nichts träumt? Hat es schon alles, was es braucht? Eine Grundregel ist, dass jeder irgendetwas braucht – auch wenn es tief in einem verborgen liegt. Spielsachen, Geld oder einfach nur ein wenig Liebe?',
                    station: 'Erdgeschoss - Foyer',
                    capacity: 'Mehrere Teams',
                    descriptionGame: 'Auf dem Tisch liegen Malen-nach-Zahlen-Blätter. Sie zeigen versteckte Wünsche von Kindern, und das entstandene Bild wird mithilfe einer Bild-Zahlen-Tabelle in eine Lösungszahl umgewandelt.',
                    descriptionPoints: 'Tragt die Lösungszahl in das entsprechende Feld ein.'
                },
                {
                    language: 'en',
                    title: 'Wishless?',
                    story: 'Every year, Santa fulfills millions of wishes. But what happens when a child makes no wish at all? When it dreams of nothing? Does it already have everything it needs? One basic rule is that everyone needs something — even if it’s hidden deep inside. Toys, money, or simply a little love?',
                    station: 'Ground Floor - Foyer',
                    capacity: 'Multiple Teams',
                    descriptionGame: 'On the table are “paint by numbers” sheets showing hidden wishes of children. The completed image is then converted into a solution number using the picture-number table.',
                    descriptionPoints: 'Enter the solution number into the corresponding field.'
                }
            ]
        }
    }
});


const game19 = await prisma.game.create({
    data: {
        url: 'https://www.youtube.com/embed/VvXDp5jZL4A',
        tagged:":unit:Treffer:unit:",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Glühwein-Pong',
                    story: 'Die Jahreszeit gibt es vor: es wird immer kälter. Am Nordpol ist es immer eisig und klassische Partyspiele wollen dem entgegenwirken. Glühwein-Pong ist ein vollkommen neues, individuell und einzigartiges Spiel, was es nur hier gibt.',
                    station: 'Erdgeschoss - Raum 108',
                    capacity: '2x 2 Teams',
                    descriptionGame: 'Das Spiel benötigt ein Gegenerteam! Die Wasser gefüllten Becher werden auf die Pyramiden Markierung gestellt. Es wird in dieser Version mit 6 Bechern gespielt, von der Spitze hinab aufgebaut. Die Teams und Spieler werfen abwechselnd (außer auf den mit den Bällen drin). Gilt ein Becher als getroffen, wird dieser beiseite gestellt. Sind alle Becher eines Teams getroffen, ist das Spiel beendet.',
                    descriptionPoints: 'Jeder Spieler trägt die vom ihm getroffenen Becher in sein #Feld ein.'
                },
                {
                    language: 'en',
                    title: 'Mulled Wine Pong',
                    story: 'The season dictates: it\'s getting colder and colder. At the North Pole, it’s always freezing, and classic party games are designed to counteract that. Mulled Wine Pong is a completely new, individual and unique game that is only available here.',
                    station: 'Ground Floor - Room 108',
                    capacity: '2x 2 teams',
                    descriptionGame: 'The game requires an opposing team. The water-filled cups are placed on the pyramid marker. In this version we will play with 6 cups, placed top down from the pyramids tip. The teams and players take turns throwing. If a cup is deemed to have been hit, it is set aside. Once all of a team\'s cups have been hit, the game is over.',
                    descriptionPoints: 'Each player enters the cups they have hit in their #field.'
                }
            ]
        }
    }
});


const game20 = await prisma.game.create({
    data: {
        url: 'https://www.youtube.com/embed/WXbwk-7uOTg',
        
        tagged: "hideF2,hideF3,hideF4,field1,lowest,:unit:sec:unit:",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Ladezone',
                    story: 'Kurz vor Weihnachten erreichten schlechte Nachrichten den Nordpol. Die Geschenke-Lieferungen sind bedroht, weil sich das Partnerunternehmen DB-Schenker aufgelöst hat. Jetzt müssen in letzter Sekunde alle Lieferungen nach Deutschland auf die traditionelle Art eingepackt und an die Kinder geliefert werden: mit dem Schlitten.',
                    station: 'Obergeschoss 1 - Ostflügel Flur',
                    capacity: '1 Team oder 2 Teams',
                    descriptionGame: 'Es werden (4 Spieler) 1 Zeit-Stopper, 2 Rentier und 1 Elf benötigt. Der Stopper gibt das Startsignal zum Beladen und Liefern, ab dann läuft die Zeit. Der Elf belädt den Schlitten mit den Geschenken vom Tisch. Die beiden Rentiere greifen sich (vorab) je ein Seilende am Schlitten. Sobald der Elf fertig beladen hat, laufen die Rentiere los. Wenn die die Markierung am Tannenbaum überschreiten, wird die Zeit gestoppt. Vom Schlitten fallende Gegenstände sind wieder zu beladen!',
                    descriptionPoints: 'In der Spieleauswertung muss im #Feld 1 die Zeit in Sekunden eingetragen werden.'
                },
                {
                    language: 'en',
                    title: 'Loading Zone',
                    story: 'Bad news reached the North Pole just before Christmas. The gift deliveries are threatened because the partner company DB Schenker has dissolved. Now, at the last minute, all deliveries to Germany must be packed in the traditional way and delivered to the children – by sleigh.',
                    station: 'Ground floor – East wing corridor',
                    capacity: '1 team or 2 teams',
                    descriptionGame: 'You need (4 players) 1 time stopper, 2 reindeer and 1 elf. The stopper gives the starting signal for loading and delivery, and from then on, the clock starts ticking. The elf loads the sleigh with presents from the table. The two reindeer each grab (in advance) one end of the rope on the sleigh. As soon as the elf has finished loading, the reindeer set off. When they pass the mark on the Christmas tree, the time is stopped. Objects that fall off the sleigh must be put back on!',
                    descriptionPoints: 'In the game evaluation, the time in seconds must be entered in #field 1.'
                }
            ]
        }
    }
});


const game21 = await prisma.game.create({
    data: {
        url: '',
        tagged:"overridePlayers,hidden",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Bescherung',
                    story: 'Im ganzen Trubel mit der Lieferung, wurden die Beschriftungen der Geschenke vergessen - für wen ist denn welches Geschenk? Die #4 #Geschenke haben je einen Inhalt der Wunschliste und ihr müsst raten, welcher es ist.',
                    station: 'Obergeschoss - Foyer am Tannenbaum',
                    capacity: 'Multiple Teams',
                    descriptionGame: 'Ihr dürft die Geschenke hochheben, schütteln, drehen und wenden, aber nicht öffnen.',
                    descriptionPoints: 'Tragt in das #Feld mit der Geschenkzahl eure Lösung (Zahl) vom Wunschzettel ein.'
                },
                {
                    language: 'en',
                    title: 'Boxing Day',
                    story: 'In all the chaos of the delivery, the gift labels were forgotten – which gift is for whom? The #4 #gifts each have a content from the wish list, and you must guess which one it is.',
                    station: 'First Floor – Foyer at the Christmas Tree',
                    capacity: 'Multiple teams',
                    descriptionGame: 'You can lift, shake, turn and rotate the gifts, but not open them.',
                    descriptionPoints: 'Enter your answer (number) from the wish list in the #field with the gift number.'
                }
            ]
        }
    }
});


const game22 = await prisma.game.create({
    data: {
        url: 'https://www.youtube.com/embed/cKgvAcYoHl0',
        tagged:":unit:Treffer:unit:",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Rentier-Jagd',
                    story: 'Unsere Rentiere wurden für die neue RedBull-Weihnachts-Werbung gecastet. Vollkommen aufgedreht von 6 Dosen Energie, sind sie weggerannt. Ihr müsst sie wieder einfangen.',
                    station: 'Erdgeschoss - Raum 108',
                    capacity: '2x 1 Team',
                    descriptionGame: 'Ungleich der Story, ist es ein Teamspiel. Ihr braucht 2 Rentier und 2 Elfen. Jeder Elf hat 5 Würfe und muss auf das Geweih des Rentiers werfen. Das Rentier versucht durch geschickte Bewegung mitzuhelfen.',
                    descriptionPoints: 'Tragt in euer #Feld, wie viele Ringe ihr getroffen/gefangen habt.'
                },
                {
                    language: 'en',
                    title: "Rudolph's Antler",
                    story: "Our reindeer were cast for the new RedBull Christmas commercial. Completely hyped up from 6 cans of energy drink, they ran away. You need to catch them again.",
                    station: 'Ground Floor – Room 108',
                    capacity: '2x 1 team',
                    descriptionGame: "Unlike the story, it is a team game. You need 2 reindeer and 2 elves. Each elf has 5 throws and must throw at the reindeer's antlers. The reindeer tries to help by moving skillfully.",
                    descriptionPoints: "Enter in your #field how many rings you have hit/captured."
                }
            ]
        }
    }
});


const game23 = await prisma.game.create({
    data: {
        url: 'https://www.youtube.com/embed/8eaXJIdMzq0',
        tagged:":unit:Zeichnungen:unit:",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Moderne Kunst',
                    story: 'Die Weihnachtswerkstatt ist in Aufruhr! Die Elfen haben ein neues Kommunikationsspiel entwickelt, um sicherzustellen, dass alle Geschenke auch wirklich richtig zugeordnet werden. Doch die Zeichnungen von Elf Nr. 21 sorgen immer wieder für Verwirrung – ist das ein Rentier oder ein Kuchen?! Jetzt liegt es an deinem Team, die richtigen Begriffe zu entschlüsseln und die Geschenklisten zu retten!',
                    station: 'Erdgeschoss - Raum 109',
                    capacity: 'Solo Team',
                    descriptionGame: 'Ihr braucht einen Timer. Jeder Spieler hat 30 Sekunden. Nach Start des Timers zieht der erste Spieler ein Begriffe aus dem Behälter. Am Whiteboard wird gezeichnet und die Mitspieler erraten den Begriff. Jeder Spieler spielt eine Runde als Zeichner.',
                    descriptionPoints: 'Die angezeichneten und erratenen Begriffe, trägt der Künstler in sein #Feld ein.'
                },
                {
                    language: 'en',
                    title: 'Modern Art',
                    story: 'The Christmas workshop is in turmoil! The elves have developed a new communication game to ensure that all the gifts are actually allocated correctly. But the drawings from Elf No. 21 cause constant confusion – is that a reindeer or a cake?! Now it\'s up to your team to decipher the correct terms and save the gift lists!',
                    station: 'Ground Floor – Room 109',
                    capacity: 'Solo Team',
                    descriptionGame: 'One player on your team is given a pen and paper and an envelope with words. They draw the words and the other team members guess what is being drawn. The time limit is 2 minutes per person. So you take turns and play 4 rounds with 4 team members. Words that have already been used are put to one side and put back in the envelope at the end.',
                    descriptionPoints: 'Each player enters the number of words explained and guessed by the team in their #field.'
                }
            ]
        }
    }
});


const game24 = await prisma.game.create({
    data: {
        url: 'https://www.youtube.com/embed/eypqWQn2hKk',
        tagged: "hideF2,hideF3,hideF4,field1,lowest",
        languages: {
            create: [
                {
                    language: 'de',
                    title: 'Alarmgesichert',
                    story: 'Heiligabend ist im vollen Gange. Schon seit Jahrhunderten beliefert Santa die Kinder, aber noch nie war es so schwer wie heutzutage. Alarmanlagen und SmartHome-Überwachung sind überall. Und dann noch dieser Zeitdruck...',
                    station: 'Obergeschoss 1 - Raum 210',
                    capacity: '1 Team',
                    descriptionGame: 'Ihr braucht 1 Zeit-Stopper und 1 bis 3 Elfen/Weihnachtsmänner. Der Stopper gibt das Signal zum Start und das Bescherungsteam muss durch den Parkour. In der Mitte sind 3 Zahlen, welche einem #Feld zugeordnet sind. Wenn alle wieder über der Start/Ziellinie sind, wird die Zeit gestoppt.',
                    descriptionPoints: 'In #Feld 1 wird die Zeit in Sekunden eingetragen. In #Feld 2 bis 4 die entsprechende Lösung.'
                },
                {
                    language: 'en',
                    title: 'Intruder Alert',
                    story: 'Christmas Eve is in full swing. For centuries, Santa has been delivering gifts to children, but it has never been as difficult as it is today. Alarm systems and smart home monitoring are everywhere. And then there\'s the time pressure...',
                    station: 'First Floor – Room 210',
                    capacity: '1 Team',
                    descriptionGame: 'You need 1 time stopper and 1 to 3 elves/Santa Clauses. The stopper gives the signal to start, and the gift-giving team must navigate through the parkour. In the center are 3 numbers, which are assigned to a #field. When everyone has crossed the start/finish line again, the time is stopped.',
                    descriptionPoints: 'The time in seconds is entered in #field 1. In #field 2 to 4 the corresponding answers.'
                }
            ]
        }
    }
});

}
