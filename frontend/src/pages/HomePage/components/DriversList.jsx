import DriverComponent from "./DriverComponent";
import '../style/DriverComponent.css';


export default function DriversList(){
    
    
    return(
        <div>
            <div className="text" align='left'>The top rated drivers </div>
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