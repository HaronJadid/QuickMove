import DriverComponent from "./DriverComponent";
import '../../../assets/DriverComponent.css';


export default function DriversList(){
    
    
    return(
        <div>
            <div className="text" align='right'>السائقون المميزون</div>
            <div className="Driverslist">
                
                <DriverComponent/>
                <DriverComponent/>
                <DriverComponent/>
                <DriverComponent/>
                <DriverComponent/>
                <DriverComponent/>



            </div>
        </div>
    )
}