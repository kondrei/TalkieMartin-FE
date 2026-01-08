import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/auth/UserContext';
import { Memory } from '@/types/gallery.type';
import { useApiFetch } from '@/utils/api.calls';
import ErrorPage from './Error.page';

export function Memories() {
  const { userData } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<Memory | null>(null);
  const { fetchData, loading, error } = useApiFetch();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!id) {
      return;
    }
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
  }, [id, fetchData]);

  if (!id) {
    return <Navigate to="/" />;
  }

  const deleteMemory = async () => {
    await fetchData(`${import.meta.env.VITE_API_URL}/memories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/text',
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });
    navigate('/');
  };

  const confirmDelete = () => {
    dialogRef.current?.showModal();
  };

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
      {userData?.sub === memory?.userId && (
        <>
          <details className="danger-accordion">
            <summary>Options</summary>
            <div className="button-group">
              <button className="button">Edit Memory</button>
              <button className="button warning" onClick={confirmDelete}>
                Delete Memory
              </button>
            </div>
          </details>
          <dialog ref={dialogRef} className="delete-dialog">
            <h2>Delete Memory?</h2>
            <p>This action cannot be undone. All photos will be permanently deleted.</p>
            <div className="dialog-actions">
              <button className="button" onClick={() => dialogRef.current?.close()}>
                Cancel
              </button>
              <button
                className="button warning"
                onClick={() => {
                  dialogRef.current?.close();
                  deleteMemory();
                }}
              >
                Delete
              </button>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
