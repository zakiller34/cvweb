import { Language } from "@/components/language-provider";

// UI Translations
export const UI_TEXT = {
  en: {
    getInTouch: "Get in Touch",
    downloadCV: "CV",
    english: "English",
    french: "Français",
    yearsExperience: "Years Experience",
    coreLanguages: "Core Languages",
    compiler: "Compiler",
    formalVerification: "Formal Verification tools",
    mscEngineering: "MSc Engineering",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageSent: "Message sent successfully!",
    messageError: "Failed to send message. Please try again.",
    yourName: "Your Name",
    yourEmail: "Your Email",
    subject: "Subject",
    message: "Message",
    contactInfo: "Contact Info",
    location: "Location",
    allRightsReserved: "All rights reserved.",
    scheduleMeeting: "Schedule Meeting",
    portfolioTitle: "Projects (Under construction...)",
    backToProjects: "Back to projects",
    viewOnGithub: "View on GitHub",
  },
  fr: {
    getInTouch: "Me contacter",
    downloadCV: "CV",
    english: "English",
    french: "Français",
    yearsExperience: "Années d'expérience",
    coreLanguages: "Langages principaux",
    compiler: "Compilateur",
    formalVerification: "Outils de vérification formelle",
    mscEngineering: "Diplôme d'ingénieur",
    sendMessage: "Envoyer",
    sending: "Envoi...",
    messageSent: "Message envoyé avec succès !",
    messageError: "Échec de l'envoi. Veuillez réessayer.",
    yourName: "Votre nom",
    yourEmail: "Votre email",
    subject: "Sujet",
    message: "Message",
    contactInfo: "Coordonnées",
    location: "Localisation",
    allRightsReserved: "Tous droits réservés.",
    scheduleMeeting: "Planifier un RDV",
    portfolioTitle: "Projets (En construction...)",
    backToProjects: "Retour aux projets",
    viewOnGithub: "Voir sur GitHub",
  },
};

// Helper function to get translated content
export function getTranslated<T>(content: { en: T; fr: T }, lang: Language): T {
  return content[lang];
}
