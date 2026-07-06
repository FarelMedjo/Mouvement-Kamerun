// Découpage administratif du Cameroun : régions → départements → arrondissements.
//
// Clé de premier niveau = nom **français** de la région (identique aux `fr` de
// `REGIONS` dans `site.js`). Les départements et arrondissements sont des noms
// propres, identiques en FR/EN → simples chaînes.
//
// Utilisé par les menus déroulants en cascade des formulaires (inscription
// scrutateur, adhésion…). « Diaspora » n'a pas de découpage : les formulaires
// retombent alors sur une saisie libre.
//
// Source : liste officielle des communes du Cameroun (annexe fiscale 2024 —
// 373 collectivités territoriales décentralisées). Vérifié département par
// département. NB : 4 communes réelles absentes de cette liste fiscale mais
// conservées ici pour l'usage citoyen : Dimako et Doumé (Haut-Nyong), Demsa et
// Tcheboa (Bénoué).
// Principales villes / localités par région (nom **français** de la région en clé,
// identique aux `fr` de `REGIONS`). Utilisé par le menu déroulant « Ville » du
// formulaire d'adhésion. « Diaspora » n'a pas de liste → saisie libre.
export const VILLES = {
  Adamaoua: ['Ngaoundéré', 'Tibati', 'Meiganga', 'Banyo', 'Tignère', 'Ngaoundal', 'Bankim', 'Dir', 'Djohong'],
  Centre: ['Yaoundé', 'Mbalmayo', 'Obala', 'Bafia', 'Nanga-Eboko', 'Akonolinga', 'Mfou', 'Éséka', 'Ntui', 'Monatélé', 'Ngoumou', 'Mbandjock', 'Nkoteng', 'Ayos', "Sa'a"],
  Est: ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Bélabo', 'Garoua-Boulaï', 'Doumé', 'Lomié', 'Ndélélé', 'Bétaré-Oya'],
  'Extrême-Nord': ['Maroua', 'Kousséri', 'Yagoua', 'Kaélé', 'Mokolo', 'Mora', 'Bogo', 'Waza', 'Mindif', 'Tokombéré'],
  Littoral: ['Douala', 'Nkongsamba', 'Édéa', 'Loum', 'Mbanga', 'Manjo', 'Melong', 'Yabassi', 'Dibombari', 'Njombé-Penja'],
  Nord: ['Garoua', 'Guider', 'Figuil', 'Poli', 'Tcholliré', 'Rey-Bouba', 'Touboro', 'Lagdo', 'Pitoa'],
  'Nord-Ouest': ['Bamenda', 'Kumbo', 'Ndop', 'Wum', 'Mbengwi', 'Fundong', 'Nkambé', 'Bali', 'Bafut', 'Jakiri', 'Batibo'],
  Ouest: ['Bafoussam', 'Dschang', 'Mbouda', 'Foumban', 'Bafang', 'Bangangté', 'Foumbot', 'Baham', 'Bandjoun', 'Kékem', 'Bafou'],
  Sud: ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Djoum', 'Lolodorf', 'Meyomessala', 'Kyé-Ossi', 'Zoétélé', 'Campo'],
  'Sud-Ouest': ['Buea', 'Limbe', 'Kumba', 'Tiko', 'Mamfe', 'Mundemba', 'Muyuka', 'Tombel', 'Mbonge', 'Ekondo-Titi', 'Bangem'],
}

export const DEPARTEMENTS = {
  Adamaoua: {
    Djérem: ['Tibati', 'Ngaoundal'],
    'Faro-et-Déo': ['Tignère', 'Galim-Tignère', 'Kontcha', 'Mayo-Baléo'],
    'Mayo-Banyo': ['Banyo', 'Bankim', 'Mayo-Darlé'],
    Mbéré: ['Meiganga', 'Dir', 'Djohong', 'Ngaoui'],
    Vina: ['Ngaoundéré 1er', 'Ngaoundéré 2e', 'Ngaoundéré 3e', 'Belel', 'Mbé', 'Nganha', 'Nyambaka', 'Martap'],
  },
  Centre: {
    'Haute-Sanaga': ['Nanga-Eboko', 'Bibey', 'Lembé-Yezoum', 'Mbandjock', 'Minta', 'Nkoteng', 'Nsem'],
    Lekié: ['Monatélé', 'Batsenga', 'Ebebda', 'Elig-Mfomo', 'Evodoula', 'Lobo', 'Obala', 'Okola', "Sa'a"],
    'Mbam-et-Inoubou': ['Bafia', 'Bokito', 'Deuk', 'Kiki', 'Kon-Yambetta', 'Makénéné', 'Ndikiniméki', 'Nitoukou', 'Ombessa'],
    'Mbam-et-Kim': ['Ntui', 'Mbangassina', 'Ngambè-Tikar', 'Ngoro', 'Yoko'],
    'Méfou-et-Afamba': ['Mfou', 'Afanloum', 'Awaé', 'Edzendouan', 'Esse', 'Nkolafamba', 'Olanguina', 'Soa'],
    'Méfou-et-Akono': ['Ngoumou', 'Akono', 'Bikok', 'Mbankomo'],
    Mfoundi: ['Yaoundé 1er', 'Yaoundé 2e', 'Yaoundé 3e', 'Yaoundé 4e', 'Yaoundé 5e', 'Yaoundé 6e', 'Yaoundé 7e'],
    'Nyong-et-Kéllé': ['Éséka', 'Biyouha', 'Bondjock', 'Bot-Makak', 'Diban', 'Makak', 'Matom', 'Messondo', 'Ngog-Mapubi', 'Nguibassal'],
    'Nyong-et-Mfoumou': ['Akonolinga', 'Ayos', 'Endom', 'Kobdombo', 'Mengang'],
    "Nyong-et-So'o": ['Mbalmayo', 'Akoeman', 'Dzeng', 'Mengueme', 'Ngomedzap', 'Nkolmetet'],
  },
  Est: {
    'Boumba-et-Ngoko': ['Yokadouma', 'Gari-Gombo', 'Moloundou', 'Salapoumbé'],
    'Haut-Nyong': ['Abong-Mbang', 'Angossas', 'Atok', 'Dimako', 'Doumaintang', 'Doumé', 'Lomié', 'Mboma', 'Messamena', 'Messok', 'Mindourou', 'Ngoyla', 'Nguelemendouka', 'Somalomo'],
    Kadey: ['Batouri', 'Kentzou', 'Kette', 'Mbang', 'Ndélélé', 'Nguélébok', 'Ouli'],
    'Lom-et-Djérem': ['Bertoua 1er', 'Bertoua 2e', 'Bélabo', 'Bétaré-Oya', 'Diang', 'Garoua-Boulaï', 'Mandjou', 'Ngoura'],
  },
  'Extrême-Nord': {
    Diamaré: ['Maroua 1er', 'Maroua 2e', 'Maroua 3e', 'Bogo', 'Dargala', 'Gazawa', 'Meri', 'Ndoukoula', 'Pette'],
    'Logone-et-Chari': ['Kousséri', 'Blangoua', 'Darak', 'Fotokol', 'Goulfey', 'Hilé-Alifa', 'Logone-Birni', 'Makary', 'Waza', 'Zina'],
    'Mayo-Danay': ['Yagoua', 'Datcheka', 'Gobo', 'Guémé', 'Guéré', 'Kai-Kai', 'Kalfou', 'Kar-Hay', 'Maga', 'Tchatibali', 'Wina'],
    'Mayo-Kani': ['Kaélé', 'Dziguilao', 'Guidiguis', 'Mindif', 'Moulvoudaye', 'Moutourwa', 'Touloum'],
    'Mayo-Sava': ['Mora', 'Kolofata', 'Tokombéré'],
    'Mayo-Tsanaga': ['Mokolo', 'Bourrha', 'Hina', 'Koza', 'Mogodé', 'Mozogo', 'Soulédé-Roua'],
  },
  Littoral: {
    Moungo: ['Nkongsamba 1er', 'Nkongsamba 2e', 'Nkongsamba 3e', 'Baré-Bakem', 'Bonaléa', 'Dibombari', 'Ébone', 'Loum', 'Manjo', 'Mbanga', 'Melong', 'Mombo', 'Njombé-Penja'],
    Nkam: ['Yabassi', 'Nkondjock', 'Yingui', 'Ndobian'],
    'Sanaga-Maritime': ['Édéa 1er', 'Édéa 2e', 'Dibamba', 'Dizangué', 'Massock', 'Mouanko', 'Ndom', 'Ngambè', 'Ngwei', 'Nyanon', 'Pouma'],
    Wouri: ['Douala 1er', 'Douala 2e', 'Douala 3e', 'Douala 4e', 'Douala 5e', 'Manoka'],
  },
  Nord: {
    Bénoué: ['Garoua 1er', 'Garoua 2e', 'Garoua 3e', 'Bascheo', 'Bibémi', 'Dembo', 'Demsa', 'Gaschiga', 'Lagdo', 'Mayo-Hourna', 'Ngong', 'Pitoa', 'Tcheboa', 'Touroua'],
    Faro: ['Poli', 'Béka'],
    'Mayo-Louti': ['Guider', 'Figuil', 'Mayo-Oulo'],
    'Mayo-Rey': ['Tcholliré', 'Madingring', 'Rey-Bouba', 'Touboro'],
  },
  'Nord-Ouest': {
    Boyo: ['Fundong', 'Belo', 'Fonfuka', 'Njinikom'],
    Bui: ['Kumbo', 'Jakiri', 'Mbiame', 'Nkum', 'Nkor', 'Oku'],
    'Donga-Mantung': ['Nkambé', 'Ako', 'Misaje', 'Ndu', 'Nwa'],
    Menchum: ['Wum', 'Furu-Awa', 'Benakuma', 'Zhoa'],
    Mezam: ['Bamenda 1er', 'Bamenda 2e', 'Bamenda 3e', 'Bafut', 'Bali', 'Santa', 'Tubah'],
    Momo: ['Mbengwi', 'Andek', 'Batibo', 'Njikwa', 'Widikum'],
    'Ngo-Ketunjia': ['Ndop', 'Babessi', 'Balikumbat'],
  },
  Ouest: {
    Bamboutos: ['Mbouda', 'Babadjou', 'Batcham', 'Galim'],
    'Haut-Nkam': ['Bafang', 'Bakou', 'Bana', 'Bandja', 'Banka', 'Banwa', 'Kékem'],
    'Hauts-Plateaux': ['Baham', 'Bamendjou', 'Bangou', 'Batié'],
    'Koung-Khi': ['Bayangam', 'Demdeng', 'Pété-Bandjoun'],
    Menoua: ['Dschang', 'Fokoué', 'Fongo-Tongo', 'Nkong-Zem', 'Penka-Michel', 'Santchou'],
    Mifi: ['Bafoussam 1er', 'Bafoussam 2e', 'Bafoussam 3e'],
    Ndé: ['Bangangté', 'Bassamba', 'Bazou', 'Tonga'],
    Noun: ['Foumban', 'Bangourain', 'Foumbot', 'Kouoptamo', 'Koutaba', 'Magba', 'Malantouen', 'Massangam', 'Njimom'],
  },
  Sud: {
    'Dja-et-Lobo': ['Sangmélima', 'Bengbis', 'Djoum', 'Meyomessala', 'Meyomessi', 'Mintom', 'Oveng', 'Zoétélé'],
    Mvila: ['Ebolowa 1er', 'Ebolowa 2e', 'Ebolowa 3e', 'Biwong-Bané', 'Biwong-Bulu', 'Efoulan', 'Mengong', 'Mvangan', 'Ngoulemakong'],
    Océan: ['Kribi 1er', 'Kribi 2e', 'Akom II', 'Bipindi', 'Campo', 'Lolodorf', 'Lokoundjé', 'Mvengue', 'Niété'],
    'Vallée-du-Ntem': ['Ambam', 'Kyé-Ossi', "Ma'an", 'Olamze'],
  },
  'Sud-Ouest': {
    Fako: ['Limbe 1er', 'Limbe 2e', 'Limbe 3e', 'Buea', 'Idenau', 'Muyuka', 'Tiko'],
    'Koupé-Manengouba': ['Bangem', 'Nguti', 'Tombel'],
    Lebialem: ['Menji', 'Alou', 'Wabane'],
    Manyu: ['Mamfe', 'Akwaya', 'Eyumojock', 'Tinto'],
    Meme: ['Kumba 1er', 'Kumba 2e', 'Kumba 3e', 'Konye', 'Mbonge'],
    Ndian: ['Mundemba', 'Bamusso', 'Dikome-Balue', 'Ekondo-Titi', 'Idabato', 'Isangele', 'Kombo-Abedimo', 'Kombo-Itindi', 'Toko'],
  },
}
