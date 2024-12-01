export const languages = [
  { code: 'es', name: 'Spanish', displayName: 'Español' },
  { code: 'en', name: 'English', displayName: 'English' },
  { code: 'fr', name: 'French', displayName: 'Français' },
  { code: 'de', name: 'German', displayName: 'Deutsch' }
];

export const getLanguageByCode = (code) => {
  return languages.find(lang => lang.code === code) || languages[0];
};
