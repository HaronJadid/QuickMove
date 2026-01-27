import CommentComponent from './CommentComponent.jsx'
import '../style/comment.css'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CommentsList() {
    const { t } = useTranslation();
    const [comments, setComments] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${API_URL}api/evaluations/latest`);
                setComments(res.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [API_URL]);

    return (
        <div>
            <div className='text1' align='center'>
                Customer Opinions
            </div>
            <div className='text2' align='center'> What Our Clients Say </div>
            <div className='text3' align='center'>Real experiences from clients who used our platform to move their furniture </div>
            <div className='list'>
                {comments.filter(c => c.text && c.text.trim().length > 0).length > 0 ? (
                    comments.filter(c => c.text && c.text.trim().length > 0).map((comment) => (
                        <CommentComponent
                            key={comment.id}
                            name={comment.name}
                            location={comment.location} // This might be static "Morocco" for now
                            text={comment.text}
                            rating={comment.rating}
                            date={new Date(comment.date).toLocaleDateString()}
                            image={comment.image}
                        />
                    ))
                ) : (
                    // Fallback or empty state, or keep static placeholders if preferred during dev? 
                    // User asked to "connect to backend". So if empty, show nothing or Loading.
                    // Let's keep it empty or maybe a loader.
                    <div style={{ textAlign: 'center', width: '100%', color: '#888' }}>No reviews yet.</div>
                )}
            </div>
        </div>
    )
}