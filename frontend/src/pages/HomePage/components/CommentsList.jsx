import CommentComponent from './CommentComponent.jsx'
import '../style/comment.css'
import { useTranslation } from 'react-i18next';

export default function CommentsList() {
    const { t } = useTranslation();

    return (
        <div>
            <div className='text1' align='center'>
                Customer Opinions
            </div>
            <div className='text2' align='center'> What Our Clients Say </div>
            <div className='text3' align='center'>Real experiences from clients who used our platform to move their furniture </div>
            <div className='list'>
                <CommentComponent name=" Sara Benali" location="Rabat" />
                <CommentComponent name="Kareem Tazi " location="Rabat" />
                <CommentComponent name="Mohamed Alami " location="Tanger" />

            </div>
        </div>
    )
}