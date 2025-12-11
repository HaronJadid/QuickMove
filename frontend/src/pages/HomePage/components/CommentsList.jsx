import CommentComponent from './CommentComponent.jsx'
import '../../../assets/comment.css'

export default function CommentsList(){
    return(
        <div>
            <div className='text1' align='center'>
                آراء العملاء
            </div>
            <div className='text2' align='center'>ماذا يقول عملاؤنا</div>
            <div className='text3' align='center'>تجارب حقيقية من عملاء استخدموا منصتنا لنقل أثاثهم</div>
            <div className='list'>
                <CommentComponent name="سارة بنعلي" location="الرباط" />
                <CommentComponent name="كريم التازي" location="الرباط" />
                <CommentComponent name="محمد العلمي" location="طنجة" />

            </div>
        </div>
    )
}