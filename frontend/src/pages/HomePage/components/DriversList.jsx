import DriverComponent from "./DriverComponent";
import '../style/DriverComponent.css';
import { useTranslation } from 'react-i18next';


export default function DriversList() {
    const { t } = useTranslation();

    return (
        <div>
            <div className="text" >{t('home.drivers.featured_title')}</div>
            <div className="Driverslist">

                <DriverComponent />
                <DriverComponent />
                <DriverComponent />
                <DriverComponent />
                <DriverComponent />
                <DriverComponent />



            </div>
        </div>
    )
}