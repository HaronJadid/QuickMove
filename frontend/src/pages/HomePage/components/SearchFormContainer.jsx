import SearchForm from "./SearchForm";
import '../style/SearchForm.css';
import React,{forwardRef} from "react";


 const SearchFormContainer=forwardRef((props,ref)=>{
    return(
     <div className="sfc"  >
        <div className="text">
            <div className="text1" align='center' >
              Reliable Furniture Moving Platform
            </div>
            <div className="text2" align='center'>
                Find a Reliable Driver
            </div>
            <div className="text3" align='center'>
               To Move Your Furniture Safely
            </div>
            <div className="text4" align='center' ref={ref}>
                Discover the best certified drivers in Morocco to move your furniture between cities
                with transparent prices and genuine reviews

            </div>
        </div>

        <SearchForm  />
        <div align='center'>
            <div className="minit">Certified Drivers </div>
            <div className="minit"> Reliable Reviews</div>
            <div className="minit"> Transparent Prices</div>
        </div>
     </div>   
    )
})

export default SearchFormContainer
