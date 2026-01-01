import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <button
            onClick={toggleLanguage}
            style={{
                padding: '5px 10px',
                margin: '0 10px',
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: 'inherit',
                fontSize: '0.9rem'
            }}
        >
            {i18n.language === 'en' ? 'العربية' : 'English'}
        </button>
    );
};

export default LanguageSwitcher;
