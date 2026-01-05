import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import gallery from '@/components/gallery';
import { Memory } from '@/types/gallery.type';
import { useApiFetch } from '@/utils/api.calls';
import ErrorPage from './Error.page';

export function Memories() {
  const { id } = useParams();
  if (!id) {
    return <Navigate to="/" />;
  }

  const [memory, setMemory] = useState<Memory | null>(null);
  const { fetchData, loading, error } = useApiFetch();
  useEffect(() => {
    const fetchGallery = async (): Promise<void> => {
      const data: Memory = await fetchData(`${import.meta.env.VITE_API_URL}/memories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/text',
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });
      setMemory(data);
    };

    fetchGallery();
  }, []);

  return (
    <div>
      {error ? (
        <>
          <ErrorPage message={error?.message} homeWrap={false} />
        </>
      ) : loading ? (
        <p>Loading...</p>
      ) : null}

      {memory?.memoryContent?.length && (
        <>
          <h1>{memory?.title}</h1>
          {memory?.memoryContent.map((content, index) => (
            <div key={index} className="photo-card">
              <div className="photo-top">
                <div className="photo-badge">{content.description}</div>{' '}
              </div>
              <div className="photo-footer">
                {new Date(content.dateCreated).toLocaleDateString('ro-RO')}
              </div>
              <img src={content.filePath as string} alt={content.description as string} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
