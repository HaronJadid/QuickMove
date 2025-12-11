import SearchForm from "./SearchForm";
import '../../../assets/SearchForm.css';


export default function SearchFormContainer(){
    return(
     <div className="sfc">
        <div className="text">
            <div className="text1" align='center'>
                منصة نقل الأثاث الموثوقة
            </div>
            <div className="text2" align='center'>
                ابحث عن سائق موثوق
            </div>
            <div className="text3" align='center'>
                لنقل أثاثك بأمان
            </div>
            <div className="text4" align='center'>
                اكتشف أفضل السائقين المعتمدين في المغرب لنقل أثاثك بين المدن
مع أسعار شفافة وتقييمات حقيقية                  
            </div>
        </div>

        <SearchForm/>
        <div align='center'>
            <div className="minit">سائقون معتمدون</div>
            <div className="minit">تقييمات موثوقة</div>
            <div className="minit">أسعار شفافة</div>
        </div>
     </div>   
    )
}
