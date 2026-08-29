// Static-label dictionaries for the public digital menu, ported from the
// reference static menu (ethio_bites/web_menu/app.js). Default language: 'en'.

export type MenuLang = 'en' | 'am';

export interface MenuLabels {
  loadingText: string;
  errorTitle: string;
  errorMessage: string;
  invalidTitle: string;
  invalidMessage: string;
  searchPlaceholder: string;
  vegFilterText: string;
  emptyTitle: string;
  emptyDesc: string;
  labelPrep: string;
  labelServing: string;
  labelSpicy: string;
  labelIngredients: string;
  labelAllergens: string;
  mins: string;
  person: string;
  people: string;
  notSpecified: string;
  none: string;
  langLabel: string;
  poweredBy: string;
  drinksTab: string;
  unavailable: string;
  vegetarian: string;
}

export const translations: Record<MenuLang, MenuLabels> = {
  en: {
    loadingText: 'Loading delicious menu...',
    errorTitle: 'Menu unreachable',
    errorMessage:
      "This restaurant's menu could not be loaded due to a connectivity issue. Please try again later.",
    invalidTitle: 'Unable to load menu',
    invalidMessage:
      'Please scan the QR code again or contact restaurant staff.',
    searchPlaceholder: 'Search menu...',
    vegFilterText: 'Vegetarian Only',
    emptyTitle: 'No items found',
    emptyDesc:
      'Try searching with a different keyword or checking other categories.',
    labelPrep: 'Prep Time',
    labelServing: 'Serving Size',
    labelSpicy: 'Spiciness',
    labelIngredients: 'Ingredients',
    labelAllergens: 'Allergens',
    mins: 'mins',
    person: 'person',
    people: 'people',
    notSpecified: 'Not specified',
    none: 'None',
    langLabel: 'አማርኛ',
    poweredBy: 'Powered by',
    drinksTab: 'Drinks',
    unavailable: 'Unavailable',
    vegetarian: 'Vegetarian',
  },
  am: {
    loadingText: 'ጣፋጭ ምናሌ በመጫን ላይ ነው...',
    errorTitle: 'ምናሌውን መጫን አልተቻለም',
    errorMessage:
      'እባክዎን ትንሽ ቆይተው እንደገና ይሞክሩ ወይም የሬስቶራንቱን ሰራተኞች ያነጋግሩ።',
    invalidTitle: 'ምናሌውን መጫን አልተቻለም',
    invalidMessage:
      'እባክዎን የ QR ኮዱን እንደገና ይቃኙ ወይም የሬስቶራንቱን ሰራተኞች ያነጋግሩ።',
    searchPlaceholder: 'ምናሌ ይፈልጉ...',
    vegFilterText: 'የጾም ብቻ',
    emptyTitle: 'ምንም ምግብ አልተገኘም',
    emptyDesc: 'በሌላ ቃል ለመፈለግ ይሞክሩ ወይም ሌሎች ክፍሎችን ይመልከቱ።',
    labelPrep: 'የዝግጅት ጊዜ',
    labelServing: 'መጠን',
    labelSpicy: 'ቃሪያ/ቅመም',
    labelIngredients: 'ግብዓቶች',
    labelAllergens: 'አለርጂ የሚያስነሱ',
    mins: 'ደቂቃ',
    person: 'ሰው',
    people: 'ሰው',
    notSpecified: 'አልተጠቀሰም',
    none: 'የለም',
    langLabel: 'English',
    poweredBy: 'አዘጋጅ',
    drinksTab: 'መጠጦች',
    unavailable: 'አይገኝም',
    vegetarian: 'የጾም',
  },
};

export const DEFAULT_LANG: MenuLang = 'en';
