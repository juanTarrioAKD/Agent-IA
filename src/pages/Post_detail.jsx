import React from 'react';
import { useParams } from 'react-router-dom';
import TiltedCard from '../components/tilted_card';

const misPublicaciones = [
  { id: 1, text: 'Proyecto React', image: 'https://picsum.photos/id/10/600/600' },
  { id: 2, text: 'Diseño UX', image: 'https://picsum.photos/id/20/600/600' },
  { id: 3, text: 'Inteligencia Art', image: 'https://picsum.photos/id/30/600/600' },
  { id: 4, text: 'Fotografía', image: 'https://picsum.photos/id/40/600/600' },
];

const PostDetail = () => {
  const { id } = useParams();
  const postId = parseInt(id);
  const post = misPublicaciones.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="detalle-container">
        <h1>Post no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="detalle-container">
       <h1>Detalle del Post {id}</h1>
       <TiltedCard 
          imageSrc={post.image}
          captionText={post.text}
       />
    </div>
  );
};

export default PostDetail;