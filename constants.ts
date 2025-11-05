export const GENDERS: ('male' | 'female')[] = ['male', 'female'];

export const BLOOD_GROUPS: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ESTABLISHMENT_TYPES: ('Hôpital' | 'Clinique' | 'Banque_de_Sang')[] = ['Hôpital', 'Clinique', 'Banque_de_Sang'];

export const URGENCY_LEVELS: ('Normal' | 'Urgent')[] = ['Normal', 'Urgent'];

// A map where the key is the recipient's blood type and the value is an array of compatible donor blood types.
export const BLOOD_COMPATIBILITY_MAP: { [key: string]: string[] } = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // Universal donor for red blood cells
};

export const WILAYAS: string[] = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'
];

export const COMMUNES: { [key: string]: string[] } = {
  'Alger': ['Alger Centre', 'Sidi M\'Hamed', 'El Madania', 'Belouizdad', 'Bab El Oued', 'Bologhine', 'Casbah', 'Oued Koriche', 'Bir Mourad Raïs', 'El Biar', 'Bouzareah', 'Birkhadem', 'El Harrach', 'Baraki', 'Oued Smar', 'Bachdjerrah', 'Hussein Dey', 'Kouba', 'Bourouba', 'Dar El Beïda', 'Bab Ezzouar'],
  'Oran': ['Oran', 'Gdyel', 'Bir El Djir', 'Hassi Bounif', 'Es Senia', 'Arzew', 'Bethioua', 'Marsat El Hadjadj', 'Aïn El Turk', 'El Ançor', 'Oued Tlelat', 'Tafraoui', 'Sidi Chami', 'Boufatis', 'Mers El Kébir'],
  'Constantine': ['Constantine', 'Hamma Bouziane', 'Didouche Mourad', 'Zighoud Youcef', 'Aïn Smara', 'El Khroub'],
  'Annaba': ['Annaba', 'Berrahal', 'El Hadjar', 'El Bouni', 'Seraïdi', 'Sidi Amar', 'Chetaïbi', 'Oued El Aneb', 'Treat', 'Chorfa', 'El Eulma'],
  'Sétif': ['Sétif', 'Aïn Arnat', 'Aïn Abessa', 'Aïn Lahdjar', 'Aïn Oulmene', 'Aïn Sebt', 'Aïn Azel', 'Aïn El Kebira', 'Amoucha', 'Babor', 'Bazer Sakhra', 'Beidha Bordj', 'Belaa', 'Beni Aziz', 'Beni Chebana', 'Beni Fouda', 'Beni Hocine', 'Beni Mouhli', 'Bir El Arch', 'Bir Haddada', 'Bouandas', 'Bougaa', 'Dehamcha', 'Djemaa', 'Draâ Kebila', 'El Eulma', 'El Ouldja', 'El Ouricia', 'Guellal', 'Guenzet', 'Guidjel', 'Hamma', 'Hammam Guergour', 'Hammam Soukhna', 'Harbil', 'Ksar El Abtal', 'Maaouia', 'Mahdia', 'Maoklane', 'Mezloug', 'Oued El Barad', 'Ouled Addouane', 'Ouled Sabor', 'Ouled Si Ahmed', 'Ouled Tebben', 'Rasfa', 'Salah Bey', 'Serdj El Ghoul', 'Talaifacene', 'Tamazirt', 'Tella', 'Tizi N\'Bechar'],
  'Adrar': ['Adrar', 'Tamentit', 'Bouda'],
  'Chlef': ['Chlef', 'Ténès', 'Béni Haoua'],
  'Laghouat': ['Laghouat', 'Aflou', 'Ksar El Hirane'],
  'Oum El Bouaghi': ['Oum El Bouaghi', 'Aïn Béïda', 'Ksar Sbahi'],
  'Batna': ['Batna', 'Barika', 'Merouana'],
  'Béjaïa': ['Béjaïa', 'Akbou', 'Amizour'],
  'Biskra': ['Biskra', 'Tolga', 'Sidi Okba'],
  'Béchar': ['Béchar', 'Beni Abbes', 'Taghit'],
  'Blida': ['Blida', 'Boufarik', 'Mouzaia'],
  'Bouira': ['Bouira', 'Lakhdaria', 'Sour El Ghozlane'],
  'Tamanrasset': ['Tamanrasset', 'In Salah', 'In Guezzam'],
  'Tébessa': ['Tébessa', 'Bir el-Ater', 'Chéria'],
  'Tlemcen': ['Tlemcen', 'Maghnia', 'Ghazaouet'],
  'Tiaret': ['Tiaret', 'Frenda', 'Sougueur'],
  'Tizi Ouzou': ['Tizi Ouzou', 'Azazga', 'Draâ Ben Khedda'],
  'Djelfa': ['Djelfa', 'Messaad', 'Aïn Oussara'],
  'Jijel': ['Jijel', 'Taher', 'El Milia'],
  'Saïda': ['Saïda', 'Youb', 'Aïn El Hadjar'],
  'Skikda': ['Skikda', 'Azzaba', 'Collo'],
  'Sidi Bel Abbès': ['Sidi Bel Abbès', 'Tessala', 'Sidi Lahcene'],
  'Guelma': ['Guelma', 'Hammam Debagh', 'Oued Zenati'],
  'Médéa': ['Médéa', 'Berrouaghia', 'Ksar Boukhari'],
  'Mostaganem': ['Mostaganem', 'Sidi Ali', 'Aïn Tédelès'],
  'M\'Sila': ['M\'Sila', 'Bou Saada', 'Hammam Dhalaâ'],
  'Mascara': ['Mascara', 'Tighennif', 'Mohammadia'],
  'Ouargla': ['Ouargla', 'Hassi Messaoud', 'Touggourt'],
  'El Bayadh': ['El Bayadh', 'Bougtob', 'El Abiodh Sidi Cheikh'],
  'Illizi': ['Illizi', 'Djanet', 'In Amenas'],
  'Bordj Bou Arreridj': ['Bordj Bou Arreridj', 'Ras El Oued', 'Mansoura'],
  'Boumerdès': ['Boumerdès', 'Boudouaou', 'Thenia'],
  'El Tarf': ['El Tarf', 'El Kala', 'Besbes'],
  'Tindouf': ['Tindouf'],
  'Tissemsilt': ['Tissemsilt', 'Theniet El Had', 'Lardjem'],
  'El Oued': ['El Oued', 'Guemar', 'Robbah'],
  'Khenchela': ['Khenchela', 'Kais', 'Chechar'],
  'Souk Ahras': ['Souk Ahras', 'Sedarata', 'M\'daourouch'],
  'Tipaza': ['Tipaza', 'Cherchell', 'Hadjout'],
  'Mila': ['Mila', 'Ferdjioua', 'Chelghoum Laïd'],
  'Aïn Defla': ['Aïn Defla', 'Miliana', 'Khemis Miliana'],
  'Naâma': ['Naâma', 'Mécheria', 'Aïn Sefra'],
  'Aïn Témouchent': ['Aïn Témouchent', 'Hammam Bou Hadjar', 'Beni Saf'],
  'Ghardaïa': ['Ghardaïa', 'Metlili', 'El Menia'],
  'Relizane': ['Relizane', 'Oued Rhiou', 'Mazouna']
};