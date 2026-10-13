/*
 * School presentation pages: the text and photos shown BEFORE the programme
 * and fee cards. Edit freely: the programme lists, durations and fees come
 * from the portal, not from here.
 *
 * Photos:
 * - Files imported from src/assets are Kazek's own photos (campus in Limbe).
 * - Paths starting with /schools/ are free photos taken in Cameroon by
 *   Cameroonian photographers on Unsplash (Unsplash License: free for
 *   commercial use). They are downloaded into public/schools/ with
 *   scripts/get-school-photos.ps1. If one is missing, a Kazek photo is shown.
 *   Replace any of them with the school's own photos when you receive them.
 */
import campusBuilding from '../assets/campus-building.jpg'
import campusClassroom from '../assets/campus-classroom.jpg'
import schoolHealth from '../assets/school-health.jpg'
import schoolHospitality from '../assets/school-hospitality.jpg'
import schoolEducation from '../assets/school-education.jpg'
import schoolVocational from '../assets/school-vocational.jpg'
import eventDefense from '../assets/event-defense.jpg'
import eventFreshmen from '../assets/event-freshmen.jpg'
import eventCulturalDay from '../assets/event-cultural-day.jpg'
import eventVolunteerDay from '../assets/event-volunteer-day.jpg'

export const FALLBACK_PHOTO = campusBuilding

// Free photos from Cameroon (Unsplash). credit = photographer shown under the photo.
const CM = {
  doualaStreet: { src: '/schools/douala-street.jpg', credit: 'Edouard TAMBA / Unsplash', fallback: campusBuilding },
  doualaBoats: { src: '/schools/douala-boats.jpg', credit: 'Edouard TAMBA / Unsplash', fallback: eventVolunteerDay },
  yaoundeStreet: { src: '/schools/yaounde-street.jpg', credit: 'Ariel Nathan ADA MBITA / Unsplash', fallback: campusBuilding },
  yaoundeAerial: { src: '/schools/yaounde-aerial.jpg', credit: 'Edouard TAMBA / Unsplash', fallback: campusBuilding },
  yaoundeTraffic: { src: '/schools/yaounde-traffic.jpg', credit: 'Youssouf NCHETKOU NDAM / Unsplash', fallback: eventFreshmen },
}

// Kazek's own photos
const KZ = {
  building: { src: campusBuilding, credit: 'Kazek University' },
  classroom: { src: campusClassroom, credit: 'Kazek University' },
  health: { src: schoolHealth, credit: 'Kazek University' },
  hospitality: { src: schoolHospitality, credit: 'Kazek University' },
  education: { src: schoolEducation, credit: 'Kazek University' },
  vocational: { src: schoolVocational, credit: 'Kazek University' },
  defense: { src: eventDefense, credit: 'Kazek University' },
  freshmen: { src: eventFreshmen, credit: 'Kazek University' },
  cultural: { src: eventCulturalDay, credit: 'Kazek University' },
  volunteer: { src: eventVolunteerDay, credit: 'Kazek University' },
}

export const SCHOOL_PROFILES = {
  GSBM: {
    hero: KZ.defense,
    side: CM.yaoundeStreet,
    gallery: [KZ.classroom, CM.doualaBoats, KZ.building],
    icon: 'trophy',
    en: {
      tagline: 'Lead with confidence: an MBA built for working professionals in Cameroon.',
      intro: [
        'The Graduate School of Business and Management prepares managers and future leaders for the realities of the Cameroonian and Central African economy. Our MBA combines management theory with practical case work drawn from local banks, ports, public services and fast-growing private companies.',
        'Classes run in the evening and online, so you can keep your job while you study. In twelve months you build the strategic, financial and people skills that employers look for when they promote to senior positions.',
      ],
      why: [
        { title: 'Designed around your job', body: 'Evening and online formats let you study without leaving work, from Limbe, Buea, Douala or anywhere in Cameroon.' },
        { title: 'Ten specialisations', body: 'From Banking and Finance to Ports and Shipping Management: choose the field where you want to grow.' },
        { title: 'Real Cameroonian cases', body: 'Learn from the way local banks, insurers, logistics firms and public administrations actually work.' },
        { title: 'A network that lasts', body: 'Study alongside experienced professionals from many sectors, and graduate with a recognised Master of Business Administration.' },
      ],
      careers: ['General manager or director', 'Finance and banking executive', 'Human resources manager', 'Logistics and port operations manager', 'Senior public administrator', 'Entrepreneur and business owner', 'Insurance manager', 'IT and information systems manager'],
    },
    fr: {
      tagline: 'Dirigez avec assurance : un MBA conçu pour les professionnels en activité au Cameroun.',
      intro: [
        "La Graduate School of Business and Management prépare les cadres et futurs dirigeants aux réalités de l'économie camerounaise et d'Afrique centrale. Notre MBA associe la théorie du management à des études de cas tirées des banques, des ports, des services publics et des entreprises privées en pleine croissance.",
        'Les cours ont lieu le soir et en ligne : vous gardez votre emploi pendant vos études. En douze mois, vous développez les compétences stratégiques, financières et humaines que recherchent les employeurs pour les postes de direction.',
      ],
      why: [
        { title: 'Pensé pour votre emploi du temps', body: "Cours du soir et en ligne : étudiez sans quitter votre travail, depuis Limbé, Buea, Douala ou partout au Cameroun." },
        { title: 'Dix spécialisations', body: 'De la Banque et Finance à la Gestion portuaire et maritime : choisissez le domaine où vous voulez évoluer.' },
        { title: 'Des cas camerounais réels', body: 'Apprenez du fonctionnement réel des banques, assurances, entreprises de logistique et administrations du pays.' },
        { title: 'Un réseau durable', body: "Étudiez aux côtés de professionnels expérimentés de nombreux secteurs et obtenez un Master of Business Administration reconnu." },
      ],
      careers: ['Directeur général', 'Cadre de banque et de finance', 'Directeur des ressources humaines', 'Responsable logistique et opérations portuaires', 'Administrateur civil principal', "Entrepreneur et chef d'entreprise", "Responsable d'assurance", "Responsable des systèmes d'information"],
    },
  },

  SBMS: {
    hero: CM.doualaStreet,
    side: KZ.hospitality,
    gallery: [KZ.classroom, CM.doualaBoats, KZ.freshmen],
    icon: 'users',
    en: {
      tagline: "Build a career in the businesses that drive Cameroon's economy.",
      intro: [
        'From the port of Douala to the hotels and beaches of Limbe, the South-West and Littoral regions are full of opportunities for well-trained professionals. The School of Business and Management Sciences gives you the practical skills to seize them: accounting, banking, marketing, logistics, hotel management and more.',
        'Start with a two-year Higher National Diploma (HND) or go straight to a Bachelor of Business Science. HND holders can top up to a Bachelor in one year. Day, evening, weekend and online options mean there is a timetable for everyone.',
      ],
      why: [
        { title: 'HND to Bachelor', body: 'Earn an HND in two years, then top up to a Bachelor degree in just one more year.' },
        { title: 'Eleven career fields', body: "Accountancy, Banking and Finance, Marketing, Hotel Management, Ports and Shipping, Insurance and more." },
        { title: 'Close to where jobs are', body: 'Our Limbe campus sits between the port city of Douala and the tourism and industry of the coast.' },
        { title: 'Study your way', body: 'Day, evening, weekend or online: keep working, or study full time.' },
      ],
      careers: ['Accountant or auditor', 'Bank and microfinance officer', 'Marketing and sales officer', 'Hotel and tourism manager', 'Logistics, transit and shipping agent', 'Insurance officer', 'Human resources assistant', 'Small business owner'],
    },
    fr: {
      tagline: "Construisez votre carrière dans les entreprises qui font avancer l'économie camerounaise.",
      intro: [
        "Du port de Douala aux hôtels et plages de Limbé, les régions du Sud-Ouest et du Littoral offrent de nombreuses opportunités aux professionnels bien formés. L'École de Commerce et des Sciences de Gestion vous donne les compétences pratiques pour les saisir : comptabilité, banque, marketing, logistique, hôtellerie et bien plus.",
        "Commencez par un HND (Higher National Diploma) en deux ans ou entrez directement en Bachelor of Business Science. Les titulaires d'un HND obtiennent le Bachelor en un an (top-up). Cours du jour, du soir, le week-end ou en ligne : il y a un horaire pour chacun.",
      ],
      why: [
        { title: 'Du HND au Bachelor', body: 'Obtenez un HND en deux ans, puis le Bachelor en une seule année supplémentaire.' },
        { title: 'Onze filières métiers', body: 'Comptabilité, Banque et Finance, Marketing, Hôtellerie, Transport maritime, Assurance et plus.' },
        { title: "Proche de l'emploi", body: "Notre campus de Limbé se situe entre la ville portuaire de Douala et le tourisme et l'industrie de la côte." },
        { title: 'Étudiez à votre rythme', body: "Jour, soir, week-end ou en ligne : continuez à travailler ou étudiez à plein temps." },
      ],
      careers: ['Comptable ou auditeur', 'Agent de banque et de microfinance', 'Chargé de marketing et de vente', "Gestionnaire d'hôtel et de tourisme", 'Agent de transit et de transport maritime', "Chargé d'assurance", 'Assistant ressources humaines', "Chef de petite entreprise"],
    },
  },

  SOE: {
    hero: KZ.education,
    side: KZ.freshmen,
    gallery: [KZ.classroom, KZ.cultural, KZ.volunteer],
    icon: 'cap',
    en: {
      tagline: "Shape the next generation of Cameroon's learners.",
      intro: [
        "Good schools need well-trained teachers, school leaders and counsellors. The School of Education trains professionals who can plan lessons, design curricula, manage schools and support every learner, including those with special needs.",
        'Programmes lead to a Higher National Diploma or a Bachelor of Education. They are ideal both for young people who want to teach and for serving teachers who want a recognised qualification and promotion.',
      ],
      why: [
        { title: 'Practical teaching skills', body: 'Didactics, lesson planning and classroom practice you can use from your first day in class.' },
        { title: 'Beyond the classroom', body: 'Specialise in Education Management, Special Education or Vocational Guidance and Counselling.' },
        { title: 'For serving teachers too', body: 'Evening, weekend and online options let teachers upgrade their qualifications while they work.' },
        { title: 'A growing need', body: "Cameroon's schools, private and public, keep looking for qualified teachers, managers and counsellors." },
      ],
      careers: ['Primary or secondary school teacher', 'Head teacher or school administrator', 'Curriculum developer', 'Special needs educator', 'Guidance counsellor', 'Education officer in an NGO or ministry', 'Trainer in a company', 'Founder of a private school'],
    },
    fr: {
      tagline: 'Formez la prochaine génération d’apprenants camerounais.',
      intro: [
        "De bonnes écoles ont besoin d'enseignants, de chefs d'établissement et de conseillers bien formés. L'École d'Éducation forme des professionnels capables de préparer des cours, concevoir des programmes, diriger des établissements et accompagner chaque apprenant, y compris ceux à besoins spécifiques.",
        "Les formations mènent au HND ou au Bachelor of Education. Elles conviennent aux jeunes qui veulent enseigner comme aux enseignants en poste qui souhaitent un diplôme reconnu et une promotion.",
      ],
      why: [
        { title: 'Des compétences pratiques', body: 'Didactique, préparation de cours et pratique de classe utilisables dès le premier jour.' },
        { title: 'Au-delà de la classe', body: "Spécialisez-vous en Gestion de l'éducation, Éducation spécialisée ou Orientation et conseil." },
        { title: 'Aussi pour les enseignants en poste', body: 'Cours du soir, du week-end et en ligne pour se qualifier tout en travaillant.' },
        { title: 'Un besoin croissant', body: 'Les écoles camerounaises, publiques et privées, recherchent toujours des enseignants, gestionnaires et conseillers qualifiés.' },
      ],
      careers: ['Enseignant du primaire ou du secondaire', "Directeur d'école ou administrateur", 'Concepteur de programmes', 'Éducateur spécialisé', "Conseiller d'orientation", "Chargé d'éducation en ONG ou au ministère", 'Formateur en entreprise', "Promoteur d'école privée"],
    },
  },

  SET: {
    hero: CM.yaoundeAerial,
    side: KZ.vocational,
    gallery: [KZ.classroom, CM.yaoundeTraffic, KZ.building],
    icon: 'edit',
    en: {
      tagline: 'Engineer the roads, power, software and energy Cameroon is building.',
      intro: [
        "Cameroon is building: new roads and bridges, power plants, ports and digital services. The School of Engineering Technology trains the technicians and engineers these projects need, in civil, electrical, mechanical, chemical, petroleum and computer engineering.",
        "Limbe is at the heart of the country's oil and gas activity and close to major industrial sites, giving our students a real view of the industries they will join. Start with an HND, then continue to a Bachelor of Technology.",
      ],
      why: [
        { title: 'Six engineering fields', body: 'Civil, Electrical, Mechanical, Chemical, Petroleum and Computer (Software) Engineering.' },
        { title: 'Industry on our doorstep', body: "Limbe and the coast host energy, port and industrial activity where engineers are needed." },
        { title: 'From technician to engineer', body: 'Earn an HND in two years, then a Bachelor of Technology with a one-year top-up.' },
        { title: 'Skills for the digital economy', body: 'Computer Engineering prepares you to build software for Cameroonian businesses and institutions.' },
      ],
      careers: ['Civil works and construction technician', 'Electrical installation and maintenance engineer', 'Mechanical maintenance engineer', 'Process and chemical plant technician', 'Oil and gas field technician', 'Software developer', 'Site supervisor', 'Quality and safety (HSE) officer'],
    },
    fr: {
      tagline: "Construisez les routes, l'énergie, les logiciels et les infrastructures du Cameroun de demain.",
      intro: [
        "Le Cameroun construit : nouvelles routes et ponts, centrales électriques, ports et services numériques. L'École de Technologie et d'Ingénierie forme les techniciens et ingénieurs dont ces projets ont besoin, en génie civil, électrique, mécanique, chimique, pétrolier et informatique.",
        "Limbé est au cœur de l'activité pétrolière et gazière du pays et proche de grands sites industriels, ce qui donne à nos étudiants une vision réelle des secteurs qu'ils vont rejoindre. Commencez par un HND, puis poursuivez en Bachelor of Technology.",
      ],
      why: [
        { title: "Six filières d'ingénierie", body: 'Génie civil, électrique, mécanique, chimique, pétrolier et informatique (logiciel).' },
        { title: "L'industrie à notre porte", body: "Limbé et la côte accueillent des activités énergétiques, portuaires et industrielles qui recrutent des ingénieurs." },
        { title: "Du technicien à l'ingénieur", body: 'Un HND en deux ans, puis un Bachelor of Technology avec un top-up d’un an.' },
        { title: "Des compétences pour l'économie numérique", body: 'Le Génie informatique vous prépare à créer des logiciels pour les entreprises et institutions camerounaises.' },
      ],
      careers: ['Technicien en génie civil et construction', 'Ingénieur en installations électriques', 'Ingénieur de maintenance mécanique', "Technicien d'usine chimique", 'Technicien pétrolier et gazier', 'Développeur de logiciels', 'Conducteur de travaux', 'Responsable qualité et sécurité (HSE)'],
    },
  },

  SHBS: {
    hero: KZ.health,
    side: KZ.volunteer,
    gallery: [KZ.classroom, KZ.freshmen, KZ.building],
    icon: 'shield',
    en: {
      tagline: 'Care for communities across Cameroon as a skilled health professional.',
      intro: [
        "Hospitals, health centres, laboratories and pharmacies across Cameroon need qualified staff. The School of Health and Biomedical Sciences trains nurses, midwives, laboratory technicians and pharmacy professionals who combine scientific knowledge with compassion for patients.",
        'Choose a Higher National Diploma or a Bachelor of Science, with practical training that prepares you for the wards, the labs and the community.',
      ],
      why: [
        { title: 'Careers that matter', body: 'Nursing, Midwifery, Laboratory and Pharmacy professionals are needed in towns and villages across the country.' },
        { title: 'Science and practice', body: 'Learn the biomedical science behind care, and the hands-on skills to deliver it.' },
        { title: 'HND or Bachelor', body: 'Start with an HND or go for a Bachelor of Science, with a top-up route for HND holders.' },
        { title: 'Serve your community', body: 'From mother-and-child health to laboratory diagnosis, your work will change lives close to home.' },
      ],
      careers: ['Registered nurse', 'Midwife', 'Medical laboratory technician', 'Pharmacy technician', 'Community health worker', 'Health centre manager', 'Hospital ward supervisor', 'Public health programme officer'],
    },
    fr: {
      tagline: 'Prenez soin des communautés du Cameroun en devenant un professionnel de santé qualifié.',
      intro: [
        "Les hôpitaux, centres de santé, laboratoires et pharmacies du Cameroun ont besoin de personnel qualifié. L'École des Sciences de la Santé et Biomédicales forme des infirmiers, sages-femmes, techniciens de laboratoire et professionnels de la pharmacie qui allient connaissances scientifiques et attention aux patients.",
        "Choisissez un HND ou un Bachelor of Science, avec une formation pratique qui vous prépare aux services hospitaliers, aux laboratoires et à la santé communautaire.",
      ],
      why: [
        { title: 'Des métiers qui comptent', body: 'Infirmiers, sages-femmes, techniciens de laboratoire et de pharmacie sont recherchés dans tout le pays.' },
        { title: 'Science et pratique', body: 'Apprenez les bases biomédicales des soins et les gestes pratiques pour les dispenser.' },
        { title: 'HND ou Bachelor', body: 'Commencez par un HND ou visez un Bachelor of Science, avec un top-up pour les titulaires du HND.' },
        { title: 'Au service de votre communauté', body: 'De la santé maternelle et infantile au diagnostic de laboratoire, votre travail change des vies.' },
      ],
      careers: ['Infirmier diplômé', 'Sage-femme', 'Technicien de laboratoire médical', 'Technicien en pharmacie', 'Agent de santé communautaire', 'Gestionnaire de centre de santé', 'Surveillant de service hospitalier', 'Chargé de programme de santé publique'],
    },
  },

  ESCG: {
    hero: CM.yaoundeStreet,
    side: KZ.classroom,
    gallery: [KZ.building, CM.yaoundeTraffic, KZ.cultural],
    icon: 'globe',
    en: {
      tagline: 'Business studies in French, for careers across Cameroon and Central Africa.',
      intro: [
        "The École Supérieure de Commerce et de Gestion is Kazek's French-language business school. It offers the Licence Professionnelle and the Master Professionnel, the qualifications most widely recognised by employers in francophone Cameroon and across the CEMAC region.",
        "Students from Douala, Yaoundé and every francophone region study accounting, banking, finance, marketing, logistics and public administration, while benefiting from Kazek's bilingual campus in Limbe.",
      ],
      why: [
        { title: 'Taught in French', body: 'Licence and Master programmes in the language of business in most of Cameroon and Central Africa.' },
        { title: 'Licence to Master', body: 'A clear professional path: Licence Professionnelle, then Master Professionnel.' },
        { title: 'A bilingual advantage', body: "Study on Kazek's bilingual campus and improve your English: a real asset for employers." },
        { title: 'Ten professional fields', body: 'Accounting, Banking, Finance, Insurance, Logistics, Marketing, Human Resources, Public Administration and more.' },
      ],
      careers: ['Comptable ou contrôleur de gestion', 'Chargé de clientèle bancaire', 'Analyste financier', 'Responsable marketing et commercial', 'Gestionnaire des ressources humaines', 'Agent de transit et de logistique', "Cadre de l'administration publique", "Chargé d'assurance"],
    },
    fr: {
      tagline: "Des études de commerce en français, pour des carrières au Cameroun et en Afrique centrale.",
      intro: [
        "L'École Supérieure de Commerce et de Gestion est l'école de commerce francophone de Kazek. Elle propose la Licence Professionnelle et le Master Professionnel, les diplômes les plus reconnus par les employeurs du Cameroun francophone et de la zone CEMAC.",
        "Des étudiants de Douala, de Yaoundé et de toutes les régions francophones y étudient la comptabilité, la banque, la finance, le marketing, la logistique et l'administration publique, tout en profitant du campus bilingue de Kazek à Limbé.",
      ],
      why: [
        { title: 'Enseignement en français', body: "Licence et Master dans la langue des affaires de la majeure partie du Cameroun et de l'Afrique centrale." },
        { title: 'De la Licence au Master', body: 'Un parcours professionnel clair : Licence Professionnelle, puis Master Professionnel.' },
        { title: 'Un atout bilingue', body: "Étudiez sur le campus bilingue de Kazek et améliorez votre anglais : un vrai plus pour les employeurs." },
        { title: 'Dix domaines professionnels', body: 'Comptabilité, Banque, Finance, Assurance, Logistique, Marketing, Ressources humaines, Administration publique et plus.' },
      ],
      careers: ['Comptable ou contrôleur de gestion', 'Chargé de clientèle bancaire', 'Analyste financier', 'Responsable marketing et commercial', 'Gestionnaire des ressources humaines', 'Agent de transit et de logistique', "Cadre de l'administration publique", "Chargé d'assurance"],
    },
  },
}
