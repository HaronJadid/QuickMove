import './footer.css'
import { useTranslation } from 'react-i18next';


export default function Footer() {
    const { t } = useTranslation();

    return (
        <div className="footer" >
            <div className="t2" align='left'>{t('footer.copyright')}</div>
        </div>
    )
}