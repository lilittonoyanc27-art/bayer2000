export interface Question {
  id: number;
  sentence: string; // The sentence with blank
  englishClue?: string;
  russianClue: string;
  armenianClue: string;
  options: string[]; // 4 multiple choice options
  correctAnswer: string; // the exact string or letter
  tense: 'Futuro Simple' | 'Futuro Perfecto';
  difficulty: number; // e.g., cash amount
  explanation: {
    es: string;
    ru: string;
    am: string;
  };
}

export interface DialogueLine {
  id: number;
  speaker: 'Camarero' | 'Lucía' | 'Carlos';
  text: string; // Spanish text with [placeholder] for the blank
  translationRu: string;
  translationAm: string;
  blankId?: string; // key of the blank if this sentence has one
  correctWord?: string; // word that fits here
  hintRu?: string;
  hintAm?: string;
}

export const MILLIONAIRE_QUESTIONS: Question[] = [
  {
    id: 1,
    sentence: "Mañana yo ______ (viajar) a Madrid para visitar a mis amigos.",
    options: ["viajaré", "habré viajado", "viajaría", "viajo"],
    correctAnswer: "viajaré",
    tense: "Futuro Simple",
    difficulty: 100,
    russianClue: "Завтра я (поеду / буду путешествовать) в Мадрид...",
    armenianClue: "Վաղը ես (կճանապարհորդեմ) Մադրիդ...",
    explanation: {
      es: "Se usa el Futuro Simple para acciones que ocurrirán en el futuro ('mañana').",
      ru: "Простое будущее время (Futuro Simple) используется для действий в будущем ('завтра'). Form: radical de infinitivo + é (viajaré).",
      am: "Futuro Simple-ը (պարզ ապառնի) օգտագործվում է ապագայում կատարվող գործողությունների համար («վաղը»): Կազմությունը՝ viajar + é = viajaré:"
    }
  },
  {
    id: 2,
    sentence: "Para el próximo año, nosotros ya ______ (terminar) nuestros estudios de español.",
    options: ["terminaremos", "habremos terminado", "habrán terminado", "habremos terminando"],
    correctAnswer: "habremos terminado",
    tense: "Futuro Perfecto",
    difficulty: 200,
    russianClue: "К следующему году мы уже (закончим / будем иметь законченным) наше обучение...",
    armenianClue: "Հաջորդ տարվա դրությամբ մենք արդեն (ավարտած կլինենք) իսպաներենի մեր ուսումը...",
    explanation: {
      es: "El Futuro Perfecto expresa una acción terminada en el futuro anterior a otra acción o momento ('para el próximo año').",
      ru: "Будущее совершенное время (Futuro Perfecto) выражает действие, которое завершится к определенному моменту в будущем (habremos terminado).",
      am: "Futuro Perfecto-ն (հարակատար ապառնի) արտահայտում է գործողություն, որն ավարտված կլինի ապագայի որոշակի պահի դրությամբ («հաջորդ տարի»): Կազմությունը՝ habremos (haber-ի ապառնին) + terminado (participio):"
    }
  },
  {
    id: 3,
    sentence: "Yo sé que tú ______ (tener) mucho éxito en tu examen de mañana.",
    options: ["tenerás", "tendrás", "habrás tenido", "tendréis"],
    correctAnswer: "tendrás",
    tense: "Futuro Simple",
    difficulty: 300,
    russianClue: "Я знаю, что у тебя (будет) большой успех на завтрашнем экзамене.",
    armenianClue: "Ես գիտեմ, որ դու վաղվա քննությանդ մեծ հաջողություն (կունենաս):",
    explanation: {
      es: "El verbo 'tener' es irregular en futuro simple. Su raíz cambia a 'tendr-'.",
      ru: "Глагол 'tener' неправильный в Futuro Simple. Радикал меняется на 'tendr-', окончание для tú — 'ás' (tendrás).",
      am: "«Tener» (ունենալ) բայը անկանոն է Futuro Simple-ում: Բայարմատը դառնում է «tendr-», իսկ tú դերանվան վերջավորությունը՝ «ás» (tendrás):"
    }
  },
  {
    id: 4,
    sentence: "No te preocupes, para cuando llegues a casa, yo ya ______ (cocinar) la cena.",
    options: ["cocinaré", "habré cocinado", "habrás cocinado", "habré cocino"],
    correctAnswer: "habré cocinado",
    tense: "Futuro Perfecto",
    difficulty: 500,
    russianClue: "Не переживай, к тому времени как ты придешь домой, я уже (приготовлю / буду иметь приготовленным) ужин.",
    armenianClue: "Մի՛ անհանգստացիր, մինչև դու տուն հասնես, ես արդեն (պատրաստած կլինեմ) ընթրիքը։",
    explanation: {
      es: "Acción futura completada antes de otra acción futura ('llegues a casa'). Se forma con el futuro de 'haber' (habré) + participio de 'cocinar'.",
      ru: "Действие завершится раньше другого действия в будущем. Форма: habré (первое лицо от haber) + cocinado.",
      am: "Ապագա գործողություն, որն ավարտված կլինի մեկ այլ ապագա գործողությունից առաջ: Կազմությունը՝ haber (habré) + cocinado:"
    }
  },
  {
    id: 5,
    sentence: "El próximo fin de semana, el camarero nos ______ (decir) cuál es el plato del día.",
    options: ["dirá", "decirá", "habrá dicho", "dirán"],
    correctAnswer: "dirá",
    tense: "Futuro Simple",
    difficulty: 1000,
    russianClue: "В следующие выходные официант нам (скажет), какое сегодня блюдо дня.",
    armenianClue: "Հաջորդ հանգստյան օրերին մատուցողը մեզ (կասի), թե որն է օրվա ուտեստը:",
    explanation: {
      es: "El verbo 'decir' es irregular en futuro simple. Su raíz cambia a 'dir-', formando 'dirá' para él/ella.",
      ru: "Глагол 'decir' неправильный в будущем времени. Корень меняется на 'dir-', для 3-го лица ед.ч. — 'dirá'.",
      am: "«Decir» (ասել) բայը անկանոն է Futuro Simple-ում: Արմատը դառնում է «dir-», իսկ 3-րդ դեմքի համար (մատուցողը)՝ «dirá»:"
    }
  },
  {
    id: 6,
    sentence: "A las ocho de la tarde, ellos ya ______ (volver) del restaurante gastronómico.",
    options: ["volverán", "habrán vuelto", "habrán volvido", "volverías"],
    correctAnswer: "habrán vuelto",
    tense: "Futuro Perfecto",
    difficulty: 2000,
    russianClue: "В восемь вечера они уже (вернутся / будут возвращены) из гастрономического ресторана.",
    armenianClue: "Երեկոյան ժամը ութին նրանք արդեն (վերադարձած կլինեն) գաստրոնոմիկ ռեստորանից։",
    explanation: {
      es: "El participio del verbo 'volver' es irregular: 'vuelto' (no 'volvido'). Para 'ellos' es 'habrán vuelto'.",
      ru: "Причастие (participio) глагола 'volver' — неправильное: 'vuelto'. Форма для ellos: " + "habrán vuelto.",
      am: "«Volver» (վերադառնալ) բայի դերբայը (participio) անկանոն է՝ «vuelto»: «Նրանք» դերանվան համար կլինի՝ habrán vuelto:"
    }
  },
  {
    id: 7,
    sentence: "Mis padres ______ (hacer) una reserva en un restaurante muy elegante para su aniversario.",
    options: ["hacerán", "habrán hecho", "harán", "harían"],
    correctAnswer: "harán",
    tense: "Futuro Simple",
    difficulty: 4000,
    russianClue: "Мои родители (сделают) бронь в очень элегантном ресторане на свою годовщину.",
    armenianClue: "Իմ ծնողները իրենց տարեդարձի համար շատ շքեղ ռեստորանում ամրագրում (կանեն):",
    explanation: {
      es: "El verbo 'hacer' es irregular en futuro simple. Su raíz cambia a 'har-', para ellos es 'harán'.",
      ru: "Глагол 'hacer' (делать) неправильный в futuro simple. Корень меняется на 'har-', форма для ellos — 'harán'.",
      am: "«Hacer» (անել) բայը անկանոն է Futuro Simple-ում: Բայարմատը փոխվում է «har-»-ի, նրանք դերանվան համար՝ «harán»:"
    }
  },
  {
    id: 8,
    sentence: "Si no nos damos prisa, cuando el chef salga, los clientes ya ______ (comer) todo.",
    options: ["habrán comido", "comerán", "habrán comer", "habrás comido"],
    correctAnswer: "habrán comido",
    tense: "Futuro Perfecto",
    difficulty: 8000,
    russianClue: "Если мы не поторопимся, когда шеф выйдет, клиенты уже всё (съедят / будут иметь съеденным).",
    armenianClue: "Եթե չշտապենք, երբ շեֆ-խոհարարը դուրս գա, հաճախորդներն արդեն ամեն ինչ (կերած կլինեն):",
    explanation: {
      es: "Expresa una acción completada antes de un hito futuro ('cuando el chef salga'). Para ellos es 'habrán comido'.",
      ru: "Будущее совершенное действие. Для они (los clientes) — 'habrán comido' (haber en futuro + participio).",
      am: "Ապագայում ավարտված գործողություն՝ նախքան մեկ այլ իրադարձություն: Հաճախորդների (նրանք) համար՝ habrán comido:"
    }
  },
  {
    id: 9,
    sentence: "¿Nosotros ______ (poder) cenar en la terraza esta noche?",
    options: ["poderemos", "podremos", "habremos podido", "podríamos"],
    correctAnswer: "podremos",
    tense: "Futuro Simple",
    difficulty: 16000,
    russianClue: "Мы (сможем) поужинать на террасе сегодня вечером?",
    armenianClue: "Մենք (կկարողանա՞նք) այսօր երեկոյան ընթրել պատշգամբում:",
    explanation: {
      es: "El verbo 'poder' es irregular en futuro simple y pierde la e de la raíz, resultando en 'podr-'. Para nosotros es 'podremos'.",
      ru: "Глагол 'poder' теряет гласную 'e' в корне перед окончаниями будущего времени: 'podremos'.",
      am: "«Poder» (կարողանալ) բայը Futuro Simple-ում կորցնում է «e» տառը արմատից՝ դառնալով «podr-»: Մեզ համար՝ podremos:"
    }
  },
  {
    id: 10,
    sentence: "Dentro de una hora, yo ______ (escribir) todos los menús en español.",
    options: ["escribiré", "habré escrito", "habré escribido", "habrán escrito"],
    correctAnswer: "habré escrito",
    tense: "Futuro Perfecto",
    difficulty: 32000,
    russianClue: "Через час я уже (напишу / буду иметь написанными) все меню на испанском.",
    armenianClue: "Մեկ ժամից ես արդեն (գրած կլինեմ) բոլոր մենյուները իսպաներենով:",
    explanation: {
      es: "El participio de 'escribir' es irregular: 'escrito'. Se combina con 'habré' para indicar acción terminada en el futuro.",
      ru: "Причастие от 'escribir' — неправильное: 'escrito' (не 'escribido'). Форма для 'yo' — 'habré escrito'.",
      am: "«Escribir» բայի դերբայը անկանոն է՝ «escrito»: Yo (ես) դեմքի համար Futuro Perfecto ձևն է՝ habré escrito:"
    }
  },
  {
    id: 11,
    sentence: "Carlos y Lucía ______ (probar) el postre de almendras típico de esta cafetería.",
    options: ["probarán", "habrán probado", "probaras", "probaron"],
    correctAnswer: "probarán",
    tense: "Futuro Simple",
    difficulty: 64000,
    russianClue: "Карлос и Лусия (попробуют) миндальный десерт, типичный для этого кафе.",
    armenianClue: "Կառլոսն ու Լուսիան (կփորձեն) այս սրճարանին բնորոշ նշով աղանդերը:",
    explanation: {
      es: "Se usa el Futuro Simple ordinario para ellos (Carlos y Lucía) con la terminación '-án': probar + án = probarán.",
      ru: "Для регулярных глаголов будущего времени к инфинитиву добавляется окончание: probar + án = probarán.",
      am: "Կանոնավոր բայերի դեպքում ապառնի ժամանակաձևը կազմվում է անորոշ դերբային (infinitivo) համապատասխան վերջավորություն ավելացնելով՝ probar + án = probarán:"
    }
  },
  {
    id: 12,
    sentence: "Para cuando empiece la película, tú ya ______ (cenar) con tu hermosa familia.",
    options: ["cenarás", "habrás cenado", "habré cenado", "habrán cenado"],
    correctAnswer: "habrás cenado",
    tense: "Futuro Perfecto",
    difficulty: 125000,
    russianClue: "К началу фильма ты уже (поужинаешь) со своей прекрасной семьей.",
    armenianClue: "Մինչև ֆիլմը սկսվի, դու արդեն (ընթրած կլինես) քո գեղեցիկ ընտանիքի հետ:",
    explanation: {
      es: "El futuro de 'haber' para la segunda persona (tú) es 'habrás'. Junto al participio de cenar ('cenado') forma el Futuro Perfecto.",
      ru: "Указывает на завершенность действия к моменту в будущем (cuando empiece...). Для 'tú' форма — 'habrás cenado'.",
      am: "Ցույց է տալիս գործողության ավարտվածությունը ապագա իրադարձությունից առաջ: Tú (դու) դեմքի համար՝ habrás cenado:"
    }
  },
  {
    id: 13,
    sentence: "Si ellos vienen muy tarde al concierto, las entradas ______ (valer) menos.",
    options: ["valerán", "valdrán", "habrán valido", "valdrían"],
    correctAnswer: "valdrán",
    tense: "Futuro Simple",
    difficulty: 250000,
    russianClue: "Если они придут на концерт слишком поздно, билеты (будут стоить / цениться) меньше.",
    armenianClue: "Եթե նրանք համերգին շատ ուշ գան, տոմսերը ավելի քիչ (կարժենան):",
    explanation: {
      es: "El verbo 'valer' es irregular en futuro y condicional. Su radical cambia a 'valdr-'. Para ellos es 'valdrán'.",
      ru: "Глагол 'valer' (стоить) изменяет основу на 'valdr-', окончание для ellos — 'án' (valdrán).",
      am: "«Valer» (արժենալ) բայը անկանոն է ապառնի ժամանակաձևում: Հիմքը դառնում է «valdr-», նրանց համար՝ valdrán:"
    }
  },
  {
    id: 14,
    sentence: "Antes de salir de viaje mañana, nosotros ya ______ (hacer) las maletas.",
    options: ["haremos", "habremos hecho", "habremos hacido", "habrán hecho"],
    correctAnswer: "habremos hecho",
    tense: "Futuro Perfecto",
    difficulty: 500000,
    russianClue: "Перед тем как отправиться в путешествие завтра, мы уже (соберем / будем иметь собранными) чемоданы.",
    armenianClue: "Վաղը ճամփորդության մեկնելուց առաջ մենք արդեն (հավաքած կլինենք) ճամպրուկները։",
    explanation: {
      es: "El participio de 'hacer' es irregular: 'hecho'. Con 'nosotros' se forma 'habremos hecho'.",
      ru: "Причастие от 'hacer' — 'hecho'. Форма Futuro Perfecto для nosotros — 'habremos hecho'.",
      am: "«Hacer» բայի դերբայը անկանոն է՝ «hecho»: Մեր համար (nosotros) Futuro Perfecto ձևն է՝ habremos hecho:"
    }
  },
  {
    id: 15,
    sentence: "¿Quién de vosotros ______ (sabor -> saber) la receta secreta del pastel español de Santiago?",
    options: ["saberá", "sabrán", "sabrá", "habrá sabido"],
    correctAnswer: "sabrá",
    tense: "Futuro Simple",
    difficulty: 1000000,
    russianClue: "Кто из вас (будет знать) секретный рецепт испанского пирога Сантьяго?",
    armenianClue: "Ձեզնից ո՞վ (կիմանա) Սանտյագոյի իսպանական թխվածքի գաղտնի բաղադրատոմսը:",
    explanation: {
      es: "El verbo 'saber' es irregular en futuro simple. Su radical es 'sabr-'. Para 'quién' (él/ella, singular) es 'sabrá'.",
      ru: "Глагол 'saber' имеет основу 'sabr-'. Для вопроса 'кто' (quién, 3-е л. ед.ч.) форма — 'sabrá'.",
      am: "«Saber» (իմանալ) բայը անկանոն է Futuro Simple-ում՝ «sabr-» հիմքով: «Ո՞վ» (quién) հարցականի համար (3-րդ դեմք, եզակի) ձևն է՝ sabrá:"
    }
  }
];

export const DIALOGUE_VOCABULARY = [
  { word: "reserva", translation: "бронь / ամրագրում", hint: "¡Buenas noches! ¿Tienen una...?" },
  { word: "carta", translation: "меню / մենյու", hint: "Aquí tienen la... ¿Qué desean?" },
  { word: "primero", translation: "первое блюдо / առաջին ուտեստ", hint: "De... yo quiero el gazpacho." },
  { word: "segundo", translation: "второе блюдо / երկրորդ ուտեստ", hint: "Y para mí, la ensalada... ¿Y de...?" },
  { word: "beber", translation: "пить / խմել", hint: "Excelente... ¿Y para...?" },
  { word: "provecho", translation: "аппетит / ախորժակ", hint: "Aquí tienen sus platos. ¡Buen...!" },
  { word: "postre", translation: "десерт / աղանդեր", hint: "De... me gustaría la tarta." },
  { word: "cuenta", translation: "счет / հաշիվ", hint: "¿Nos trae la... por favor?" },
  { word: "tarjeta", translation: "карта (оплата) / քարտ (վճարում)", hint: "¿Van a pagar con... o en efectivo?" }
];

export const RESTAURANT_DIALOGUE: DialogueLine[] = [
  {
    id: 1,
    speaker: "Camarero",
    text: "¡Buenas noches! Bienvenidos al restaurante \"Sabores de España\". ¿Tienen una [reserva]?",
    translationRu: "Добрый вечер! Добро пожаловать в ресторан «Вкусы Испании». У вас есть бронь?",
    translationAm: "Բարի երեկո՜: Բարի գալուստ «Իսպանիայի համերը» ռեստորան: Դուք ունե՞ք ամրագրում:",
    blankId: "reserva",
    correctWord: "reserva",
    hintRu: "Существительное женского рода, означает предварительный заказ столика.",
    hintAm: "Իգական սեռի գոյական, նշանակում է սեղանի նախնական պատվիրում (ամրագրում):"
  },
  {
    id: 2,
    speaker: "Lucía",
    text: "Hola, buenas noches. Sí, tenemos una mesa reservada a nombre de Lucía Torres.",
    translationRu: "Здравствуйте, добрый вечер. Да, у нас забронирован столик на имя Лусии.",
    translationAm: "Բարև ձեզ, բարի երեկո: Այո, մենք ունենք ամրագրված սեղան Լուսիայի անունով:"
  },
  {
    id: 3,
    speaker: "Camarero",
    text: "Excelente, pasen por aquí, por favor. Esta es su mesa al lado de la ventana. Aquí tienen la [carta]. ¿Qué desean tomar de entrada?",
    translationRu: "Отлично, проходите сюда, пожалуйста. Вот ваш столик у окна. Вот ваше меню. Что вы желаете на закуску?",
    translationAm: "Գերազանց է, անցեք այս կողմ, խնդրեմ: Սա ձեր սեղանն է պատուհանի մոտ: Ահա մենյուն: Ի՞նչ կցանկանաք որպես նախուտեստ։",
    blankId: "carta",
    correctWord: "carta",
    hintRu: "Список блюд в ресторане.",
    hintAm: "Ռեստորանում ուտեստների ցանկը (մենյու):"
  },
  {
    id: 4,
    speaker: "Carlos",
    text: "Muchas gracias. De [primero], para mí el gazpacho andaluz, que hace mucho calor hoy.",
    translationRu: "Большое спасибо. На первое для меня андалузский гаспачо, сегодня очень жарко.",
    translationAm: "Շատ շնորհակալություն: Որպես առաջին ուտեստ՝ ինձ համար անդալուզյան գասպաչո, այսօր շատ շոգ է:",
    blankId: "primero",
    correctWord: "primero",
    hintRu: "Порядковое числительное во фразе 'на первое'",
    hintAm: "Դասական թվական «առաջին» արտահայտության մեջ, որն ասոցացվում է առաջին ուտեստի հետ:"
  },
  {
    id: 5,
    speaker: "Lucía",
    text: "Y para mí, la ensalada mixta de la casa, por favor.",
    translationRu: "А для меня, пожалуйста, домашний смешанный салат.",
    translationAm: "Իսկ ինձ համար՝ տան խառը աղցանը, խնդրեմ:"
  },
  {
    id: 6,
    speaker: "Camarero",
    text: "Muy bien. ¿Y de [segundo] plato?",
    translationRu: "Очень хорошо. А вторым блюдом?",
    translationAm: "Շատ լավ: Իսկ որպես երկրորդ ուտե՞ստ:",
    blankId: "segundo",
    correctWord: "segundo",
    hintRu: "Порядковое числительное 'второй' (segundo).",
    hintAm: "«Երկրորդ» դասական թվականը (segundo) երկրորդ ուտեստի համար:"
  },
  {
    id: 7,
    speaker: "Carlos",
    text: "A mí me gustaría probar el bacalao al pil-pil, me han dicho que es exquisito aquí.",
    translationRu: "Мне бы хотелось попробовать треску аль пиль-пиль, мне говорили, что она здесь изысканная.",
    translationAm: "Ես կցանկանայի փորձել թառափը (ձողաձուկը) պիլ-պիլ սոուսով, ինձ ասել են, որ այն այստեղ հիանալի է պատրաստվում:"
  },
  {
    id: 8,
    speaker: "Lucía",
    text: "Yo prefiero la paella de marisco, es mi plato español favorito.",
    translationRu: "Я предпочитаю паэлью с морепродуктами, это мое любимое испанское блюдо.",
    translationAm: "Ես նախընտրում եմ ծովամթերքով պաելյան, դա իմ ամենասիրելի իսպանական ուտեստն է:"
  },
  {
    id: 9,
    speaker: "Camarero",
    text: "¡Perfecto! Una elección fantástica. ¿Y para [beber]?",
    translationRu: "Отлично! Фантастический выбор. А попить (для питья)?",
    translationAm: "Հիանալի՜ է: Ֆանտաստիկ ընտրություն: Իսկ խմելո՞ւ համար:",
    blankId: "beber",
    correctWord: "beber",
    hintRu: "Глагол в инфинитиве (пить).",
    hintAm: "Բայ՝ անորոշ դերբայով (խմել):"
  },
  {
    id: 10,
    speaker: "Carlos",
    text: "Una botella de agua mineral fría y una copa de vino tinto de Rioja.",
    translationRu: "Бутылку холодной минеральной воды и бокал красного вина Риоха.",
    translationAm: "Մեկ շիշ սառը հանքային ջուր և մի բաժակ կարմիր Ռիոխա գինի:"
  },
  {
    id: 11,
    speaker: "Camarero",
    text: "(Vuelve con las bebidas y la comida después de unos minutos) Aquí tienen sus platos. ¡Buen [provecho]!",
    translationRu: "(Возвращается с напитками и едой через несколько минут) Вот ваши блюда. Приятного аппетита!",
    translationAm: "(Մի քանի րոպե անց վերադառնում է ընդմիջումից՝ խմիչքներով ու սնունդով) Ահա ձեր ուտեստները։ Բարի ախորժա՜կ։",
    blankId: "provecho",
    correctWord: "provecho",
    hintRu: "Часть испанского выражения пожелания приятного аппетита: ¡Buen...!",
    hintAm: "Իսպանական բարի ախորժակ մաղթելու արտահայտության մասը՝ ¡Buen...!"
  },
  {
    id: 12,
    speaker: "Lucía",
    text: "Muchas gracias, ¡tiene un aspecto increíble y huele delicioso!",
    translationRu: "Большое спасибо, выглядит потрясающе и пахнет восхитительно!",
    translationAm: "Շատ շնորհակալություն, այն հրաշալի տեսք ունի և բուրում է անմահական:"
  },
  {
    id: 13,
    speaker: "Carlos",
    text: "(Tras terminar la cena) Todo ha estado espectacular, de verdad. De [postre], me gustaría pedir una porción de tarta de Santiago.",
    translationRu: "(После ужина) Всё было просто великолепно, правда. На десерт я бы хотел заказать кусочек пирога Сантьяго.",
    translationAm: "(Ընթրիքն ավարտելուց հետո) Ամեն ինչ իսկապես հրաշալի էր։ Որպես աղանդեր՝ կցանկանայի պատվիրել Սանտյագոյի տորթի մի կտոր:",
    blankId: "postre",
    correctWord: "postre",
    hintRu: "Сладкое блюдо, подаваемое в конце трапезы.",
    hintAm: "Քաղցր սնունդ, որը մատուցվում է ուտելու վերջում (աղանդեր)։"
  },
  {
    id: 14,
    speaker: "Lucía",
    text: "Para mí solo un café solo, gracias. Estoy muy satisfecha.",
    translationRu: "Для меня только черный кофе, спасибо. Я очень сыта.",
    translationAm: "Ինձ համար միայն սև սուրճ, շնորհակալություն: Ես շատ կուշտ եմ:"
  },
  {
    id: 15,
    speaker: "Carlos",
    text: "Camarero, por favor, cuando pueda, ¿nos trae la [cuenta]?",
    translationRu: "Официант, пожалуйста, как сможете, принесите нам счет.",
    translationAm: "Մատուցո՜ղ, խնդրում եմ, երբ կարողանաք, մեզ կբերե՞ք հաշիվը:",
    blankId: "cuenta",
    correctWord: "cuenta",
    hintRu: "Документ с указанием общей суммы к оплате за трапезу.",
    hintAm: "Փաստաթուղթ, որտեղ նշված է վճարման ենթակա ընդհանուր գումարը (հաշիվ)։"
  },
  {
    id: 16,
    speaker: "Camarero",
    text: "Enseguida se la traigo, señor. ¿Desean pagar con [tarjeta] o prefieren en efectivo?",
    translationRu: "Сейчас принесу, сеньор. Вы хотите заплатить картой или предпочитаете наличными?",
    translationAm: "Հիմա կբերեմ, տիար։ Ցանկանում եք վճարել քարտո՞վ, թե՞ նախընտրում եք կանխիկ։",
    blankId: "tarjeta",
    correctWord: "tarjeta",
    hintRu: "Пластиковое платежное средство.",
    hintAm: "Պլաստիկ վճարային միջոց (քարտ)։"
  },
  {
    id: 17,
    speaker: "Carlos",
    text: "Con tarjeta de crédito, por favor. Muchas gracias por su excelente servicio y amabilidad.",
    translationRu: "Кредитной картой, пожалуйста. Большое спасибо за ваше прекрасное обслуживание и любезность.",
    translationAm: "Վարկային քարտով, խնդրեմ: Շատ շնորհակալություն հիանալի սպասարկման և բարյացակամության համար:"
  }
];
