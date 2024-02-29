import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      card: {
        "1.desc": "In this turn, give your hero <h2>+4</h2> Attack.",
        "2.desc": "<d2>-1</d2> damage to all minions.",
        "3.desc": "Give a friendly minion <h2>+2</h2> Attack and Charge.",
        "4.desc": "Destroy all injured minions.",
        "5.desc": "<d2>-2</d2> damage to an undamaged minion.",
        "6.desc": "Destroy an enemy minion.",
        "7.desc": "Force an enemy minion to deal damage equal to its Attack to its adjacent minions.",
        "8.desc": "<d2>-2</d2> damage to a target.<br></br>Combo: Change it to <d2>-4</d2> damage.",
        "9.desc": "Combo:<br></br>Gain <h2>+2</h2> Attack and <h2>+2</h2> Health for each other card played before this one in this turn.",
        "10.desc": "Taunt:<br></br>Damage to the enemy hero, or damage to a random minion.(Prioritize attacking minions with 'Taunt.' If none, freely attack other enemy minions or the hero)",
        "11.desc": "Taunt:<br></br>Damage to the enemy hero, or damage to a random minion.(Prioritize attacking minions with 'Taunt.' If none, freely attack other enemy minions or the hero)",
        "12.desc": "Taunt:<br></br>Damage to the enemy hero, or damage to a random minion.(Prioritize attacking minions with 'Taunt.' If none, freely attack other enemy minions or the hero)",
        "13.desc": "Taunt:<br></br>Damage to the enemy hero, or damage to a random minion.(Prioritize attacking minions with 'Taunt.' If none, freely attack other enemy minions or the hero)",
        "14.desc": "Battlecry: Silence a minion",
        "15.desc": "Battlecry: Destroy your opponent's weapon",
        "16.desc": "Battlecry: <d2>-3</d2> damage to the enemy hero",
        "17.desc": "Battlecry: Restore <h2>3</h2> Health to a character",
        "18.desc": "Battlecry: Restore <h2>2</h2> Health to a character",
        "19.desc": "Battlecry: Give a friendly minion <h2>+1</h2> Attack and <h2>+1</h2> Health",
        "20.desc": "Battlecry: Restore <h2>4</h2> Health to your hero",
        "21.desc": "Battlecry: Restore <h2>2</h2> Health to all friendly characters",
        "22.desc": "Battlecry: Give a minion <h2>+2</h2> Attack this turn",
        "23.desc": "Battlecry: <d2>-1</d2> damage",
        "24.desc": "Battlecry:<br></br>Gain <h2>+1</h2> Attack and <h2>+1</h2> Health for each other friendly minion on the battlefield.",
        "25.desc": "Attacking minions won't lose Durability, but reduce their Attack by <d2>1</d2>.",
      }
    }
  },
  // fr: {
  //   translation: {
  //     "card.16.desc": "Welcome to React and react-i18next"
  //   }
  // }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
