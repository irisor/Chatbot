import React from 'react';
import { languages } from '../src/config/languages';

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const handleLanguageChange = (newLanguageCode) => {
    if (newLanguageCode !== selectedLanguage.code) {
      if (confirm('Changing the language will reset the conversation. Do you want to continue?')) {
        const newLanguage = languages.find(lang => lang.code === newLanguageCode);
        onLanguageChange(newLanguage);
      }
    }
  };

  return (
    <select 
      value={selectedLanguage.code} 
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="language-selector"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.displayName}
        </option>
      ))}
    </select>
  );
};
