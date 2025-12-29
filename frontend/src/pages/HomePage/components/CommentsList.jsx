import CommentComponent from './CommentComponent.jsx'
import '../style/comment.css'
import { useTranslation } from 'react-i18next';

export default function CommentsList() {
    const { t } = useTranslation();

    return (
        <div>
            <div className='text1' align='center'>
                {t('home.comments.label')}
            </div>
            <div className='text2' align='center'>{t('home.comments.title')}</div>
            <div className='text3' align='center'>{t('home.comments.subtitle')}</div>
            <div className='list'>
                <CommentComponent name="سارة بنعلي" location="الرباط" />
                <CommentComponent name="كريم التازي" location="الرباط" />
                <CommentComponent name="محمد العلمي" location="طنجة" />

            </div>
        </div>
    )
}