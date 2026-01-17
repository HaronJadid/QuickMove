import './footer.css'
import { useTranslation } from 'react-i18next';


export default function Footer() {
    const { t } = useTranslation();

    return (
        <div className="footer" >
            <div className="t2" align='left'>© 2026 MoveMorocco. All rights reserved  .</div>
        </div>
    )
}