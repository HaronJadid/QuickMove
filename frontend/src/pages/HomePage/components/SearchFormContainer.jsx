import SearchForm from "./SearchForm";
import '../style/SearchForm.css';
import React, { forwardRef } from "react";
import { useTranslation } from 'react-i18next';


const SearchFormContainer = forwardRef((props, ref) => {
    const { t } = useTranslation();

    return (
        <div className="sfc"  >
            <div className="text">
                <div className="text1" align='center' >
                    {t('home.hero.subtitle')}
                </div>
                <div className="text2" align='center'>
                    {t('home.hero.title')}
                </div>
                <div className="text3" align='center'>
                    {t('home.hero.slogan')}
                </div>
                <div className="text4" align='center' ref={ref}>
                    {t('home.hero.description')}
                </div>
            </div>

            <SearchForm />
            <div align='center'>
                <div className="minit">{t('home.hero.badges.verified_drivers')}</div>
                <div className="minit">{t('home.hero.badges.reliable_ratings')}</div>
                <div className="minit">{t('home.hero.badges.transparent_prices')}</div>
            </div>
        </div>
    )
})

export default SearchFormContainer
