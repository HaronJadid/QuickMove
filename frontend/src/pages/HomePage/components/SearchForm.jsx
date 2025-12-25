import React from 'react';
import '../style/SearchForm.css';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSearchparams } from '../../SearchResult/components/SearchparamsContext.jsx';


export default function SearchForm() {
  let [err,setErr]=useState(false)


  let { ville_depart,setVille_depart,
     ville_arrivee,setVille_arrivee,
     date_depart,setDate_depart,
     type_transport,setType_transport}=useSearchparams()

  const navigate=useNavigate()

  const lookup=async()=>{
    setErr(false)
    if(ville_depart){
      navigate('/searchresult')
    }
    else{
      setErr(true)


    }
      

  }


  return (
    <div className="search-card-container" dir="rtl">
      
      <div className="card-header">
        <div className="header-title">

          <span className="search-icon-red">🔍</span>
          <h2>ابدأ البحث الآن</h2>
        </div>
      </div>

      <div className="form-grid">
        
        <div className="input-group">
          <label>مدينة المغادرة <span className="required">*</span></label>
          <select className="form-input" value={ville_depart} onChange={(event)=>setVille_depart(event.target.value)}>
            <option value="" disabled selected>اختر مدينة المغادرة </option>
            <option value="rabat">الرباط</option>
            <option value="Ad Dakhla">الداخلة</option>
            <option value="Ad Darwa">الداروة</option>
            <option value="Agadir">أكادير</option>
            <option value="Aguelmous">أغيل مؤوس</option>
            <option value="Ain El Aouda">عين العودة</option>
            <option value="Ait Melloul">أيت ملول</option>
            <option value="Ait Ourir">أيت أورير</option>
            <option value="Al Aaroui">العروي</option>
            <option value="Al Fqih Ben Çalah">الفقيه بن صالح</option>
            <option value="Al Hoceïma">الحسيمة</option>
            <option value="Al Khmissat">الخميسات</option>
            <option value="Al ’Attawia">العطاوية</option>
            <option value="Arfoud">أرفود</option>
            <option value="Azemmour">أزمور</option>
            <option value="Aziylal">أزيلال</option>
            <option value="Azrou">أزرو</option>
            <option value="Aïn Harrouda">عين حرودة</option>
            <option value="Aïn Taoujdat">عين تاوجطات</option>
            <option value="Barrechid">برشيد</option>
            <option value="Ben Guerir">بن جرير</option>
            <option value="Beni Yakhlef">بني يخلف</option>
            <option value="Berkane">بركان</option>
            <option value="Biougra">بيوڭرة</option>
            <option value="Bir Jdid">بير جديد</option>
            <option value="Bou Arfa">بو عرفة</option>
            <option value="Boujad">بوجاد</option>
            <option value="Bouknadel">بوكنادل</option>
            <option value="Bouskoura">بوسكورة</option>
            <option value="Béni Mellal">بني ملال</option>
            <option value="Casablanca">الدار البيضاء</option>
            <option value="Chichaoua">شيشاوة</option>
            <option value="Demnat">دمّْنات</option>
            <option value="El Aïoun">العيون</option>
            <option value="El Hajeb">الحاجب</option>
            <option value="El Jadid">الجديدة</option>
            <option value="El Kelaa des Srarhna">قلعة السراغنة</option>
            <option value="Errachidia">الرشيدية</option>
            <option value="Fnidq">فْنيدق</option>
            <option value="Fès">فاس</option>
            <option value="Guelmim">كلميم</option>
            <option value="Guercif">الكريّسيف</option>
            <option value="Iheddadene">إحدادن</option>
            <option value="Imzouren">إمزورن</option>
            <option value="Inezgane">إنزكان</option>
            <option value="Jerada">جرادة</option>
            <option value="Kenitra">القنيطرة</option>
            <option value="Khénifra">الخنيفرة</option>
            <option value="Kouribga">خريبڭة</option>
            <option value="Ksar El Kebir">القصر الكبير</option>
            <option value="Larache">العرائش</option>
            <option value="Laâyoune">العيون</option>
            <option value="Marrakech">مراكش</option>
            <option value="Martil">مرتيل</option>
            <option value="Mechraa Bel Ksiri">مشرع بلقصيري</option>
            <option value="Mehdya">المهدية</option>
            <option value="Meknès">مكناس</option>
            <option value="Midalt">ميدلت</option>
            <option value="Missour">ميسور</option>
            <option value="Mohammedia">المحمدية</option>
            <option value="Moulay Abdallah">مولاي عبد الله</option>
            <option value="Moulay Bousselham">مولاي بوسلهام</option>
            <option value="Mrirt">مريرت</option>
            <option value="My Drarga">مي دراركة</option>
            <option value="M’diq">المديْق</option>
            <option value="Nador">الناظور</option>
            <option value="Oued Zem">وادي زم</option>
            <option value="Ouezzane">وزان</option>
            <option value="Oujda-Angad">وجدة-أنكاد</option>
            <option value="Oulad Barhil">أولاد برحيل</option>
            <option value="Oulad Tayeb">أولاد طيب</option>
            <option value="Oulad Teïma">أولاد تايمة</option>
            <option value="Oulad Yaïch">أولاد يعِيّش</option>
            <option value="Qasbat Tadla">قصبة تادلة</option>
            <option value="Safi">آسفي</option>
            <option value="Sale">سلا</option>
            <option value="Sefrou">صفرو</option>
            <option value="Settat">سطات</option>
            <option value="Sidi Qacem">سيدي قاسم</option>
            <option value="Sidi Slimane">سيدي سليمان</option>
            <option value="Sidi Smai’il">سيدي إسماعيل</option>
            <option value="Sidi Yahia El Gharb">سيدي يحيى الغرب</option>
            <option value="Sidi Yahya Zaer">سيدي يحيى زاير</option>
            <option value="Skhirate">الصخيرات</option>
            <option value="Souk et Tnine Jorf el Mellah">سوق الأربعاء جرف الملح</option>
            <option value="Souq Sebt Oulad Nemma">سوق سبت أولاد النّمّة</option>
            <option value="Tahla">طهلة</option>
            <option value="Tameslouht">تامسلوحت</option>
            <option value="Tangier">طنجة</option>
            <option value="Taourirt">تاوريرت</option>
            <option value="Taza">تزّانّة</option>
            <option value="Temara">تمارة</option>
            <option value="Temsia">تَمْسية</option>
            <option value="Tifariti">تيفاريتي</option>
            <option value="Tit Mellil">تِّت مليل</option>
            <option value="Tiznit">تزنيت</option>
            <option value="Tétouan">تطوان</option>
            <option value="Youssoufia">يوسفية</option>
            <option value="Zagora">زگورة</option>
            <option value="Zawyat ech Cheïkh">زاوية الشيخ</option>
            <option value="Zaïo">زايو</option>
            <option value="Zeghanghane">زڭنغان</option>

          </select>
        </div>

        <div className="input-group">
          <label>مدينة الوصول </label>
          <select className="form-input" value={ville_arrivee} onChange={(event)=>setVille_arrivee(event.target.value)}>
            <option value="" disabled selected>اختر مدينة الوصول </option>
            <option value="marrakech">مراكش</option>
            <option value="tangier">طنجة</option>
            <option value="Ad Darwa">الداروة</option>
            <option value="Agadir">أكادير</option>
            <option value="Aguelmous">أغيل مؤوس</option>
            <option value="Ain El Aouda">عين العودة</option>
            <option value="Ait Melloul">أيت ملول</option>
            <option value="Ait Ourir">أيت أورير</option>
            <option value="Al Aaroui">العروي</option>
            <option value="Al Fqih Ben Çalah">الفقيه بن صالح</option>
            <option value="Al Hoceïma">الحسيمة</option>
            <option value="Al Khmissat">الخميسات</option>
            <option value="Al ’Attawia">العطاوية</option>
            <option value="Arfoud">أرفود</option>
            <option value="Azemmour">أزمور</option>
            <option value="Aziylal">أزيلال</option>
            <option value="Azrou">أزرو</option>
            <option value="Aïn Harrouda">عين حرودة</option>
            <option value="Aïn Taoujdat">عين تاوجطات</option>
            <option value="Barrechid">برشيد</option>
            <option value="Ben Guerir">بن جرير</option>
            <option value="Beni Yakhlef">بني يخلف</option>
            <option value="Berkane">بركان</option>
            <option value="Biougra">بيوڭرة</option>
            <option value="Bir Jdid">بير جديد</option>
            <option value="Bou Arfa">بو عرفة</option>
            <option value="Boujad">بوجاد</option>
            <option value="Bouknadel">بوكنادل</option>
            <option value="Bouskoura">بوسكورة</option>
            <option value="Béni Mellal">بني ملال</option>
            <option value="Casablanca">الدار البيضاء</option>
            <option value="Chichaoua">شيشاوة</option>
            <option value="Demnat">دمّْنات</option>
            <option value="El Aïoun">العيون</option>
            <option value="El Hajeb">الحاجب</option>
            <option value="El Jadid">الجديدة</option>
            <option value="El Kelaa des Srarhna">قلعة السراغنة</option>
            <option value="Errachidia">الرشيدية</option>
            <option value="Fnidq">فْنيدق</option>
            <option value="Fès">فاس</option>
            <option value="Guelmim">كلميم</option>
            <option value="Guercif">الكريّسيف</option>
            <option value="Iheddadene">إحدادن</option>
            <option value="Imzouren">إمزورن</option>
            <option value="Inezgane">إنزكان</option>
            <option value="Jerada">جرادة</option>
            <option value="Kenitra">القنيطرة</option>
            <option value="Khénifra">الخنيفرة</option>
            <option value="Kouribga">خريبڭة</option>
            <option value="Ksar El Kebir">القصر الكبير</option>
            <option value="Larache">العرائش</option>
            <option value="Laâyoune">العيون</option>
            <option value="Martil">مرتيل</option>
            <option value="Mechraa Bel Ksiri">مشرع بلقصيري</option>
            <option value="Mehdya">المهدية</option>
            <option value="Meknès">مكناس</option>
            <option value="Midalt">ميدلت</option>
            <option value="Missour">ميسور</option>
            <option value="Mohammedia">المحمدية</option>
            <option value="Moulay Abdallah">مولاي عبد الله</option>
            <option value="Moulay Bousselham">مولاي بوسلهام</option>
            <option value="Mrirt">مريرت</option>
            <option value="My Drarga">مي دراركة</option>
            <option value="M’diq">المديْق</option>
            <option value="Nador">الناظور</option>
            <option value="Oued Zem">وادي زم</option>
            <option value="Ouezzane">وزان</option>
            <option value="Oujda-Angad">وجدة-أنكاد</option>
            <option value="Oulad Barhil">أولاد برحيل</option>
            <option value="Oulad Tayeb">أولاد طيب</option>
            <option value="Oulad Teïma">أولاد تايمة</option>
            <option value="Oulad Yaïch">أولاد يعِيّش</option>
            <option value="Qasbat Tadla">قصبة تادلة</option>
            <option value="Rabat">الرباط</option>
            <option value="Safi">آسفي</option>
            <option value="Sale">سلا</option>
            <option value="Sefrou">صفرو</option>
            <option value="Settat">سطات</option>
            <option value="Sidi Qacem">سيدي قاسم</option>
            <option value="Sidi Slimane">سيدي سليمان</option>
            <option value="Sidi Smai’il">سيدي إسماعيل</option>
            <option value="Sidi Yahia El Gharb">سيدي يحيى الغرب</option>
            <option value="Sidi Yahya Zaer">سيدي يحيى زاير</option>
            <option value="Skhirate">الصخيرات</option>
            <option value="Souk et Tnine Jorf el Mellah">سوق الأربعاء جرف الملح</option>
            <option value="Souq Sebt Oulad Nemma">سوق سبت أولاد النّمّة</option>
            <option value="Tahla">طهلة</option>
            <option value="Tameslouht">تامسلوحت</option>
            <option value="Taourirt">تاوريرت</option>
            <option value="Taza">تزّانّة</option>
            <option value="Temara">تمارة</option>
            <option value="Temsia">تَمْسية</option>
            <option value="Tifariti">تيفاريتي</option>
            <option value="Tit Mellil">تِّت مليل</option>
            <option value="Tiznit">تزنيت</option>
            <option value="Tétouan">تطوان</option>
            <option value="Youssoufia">يوسفية</option>
            <option value="Zagora">زگورة</option>
            <option value="Zawyat ech Cheïkh">زاوية الشيخ</option>
            <option value="Zaïo">زايو</option>
            <option value="Zeghanghane">زڭنغان</option>

          </select>
        </div>

        <div className="input-group">
          <label>تاريخ النقل</label>
          <input type="date" className="form-input" value={date_depart} onChange={(event)=>setDate_depart(event.target.value)} />
        </div>

        <div className="input-group">
          <label>نوع المركبة </label>
          <select className="form-input" value={type_transport} onChange={(event)=>setType_transport(event.target.value)}>
            <option value="" disabled selected>اختر نوع المركبة</option>
            <option value="truck">شاحنة</option>
            <option value="van">عربة نقل</option>
          </select>
        </div>

      </div>

      <button className="submit-btn" onClick={lookup}>
        ابحث عن السائقين المتاحين 
        <span className="btn-icon">🔍</span>
      </button>
      {err &&<div style={{color:'rgba(215, 130, 144, 1)',textAlign:'center'
      }} >يجب تحديد مدينة المغادرة على الاقل !!</div>}

    </div>
  );
}