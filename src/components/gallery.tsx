import { useEffect, useState } from 'react';
import { useApiFetch } from '@/utils/api.calls';
import { Link } from 'react-router-dom';
import { GalleryData } from '@/types/gallery.type';


export default function Gallery() {
  const [gallery, setGallery] = useState<GalleryData | null>(null);

  const { fetchData, loading, error } = useApiFetch();
  useEffect(() => {
    const fetchGallery = async (): Promise<void> => {
      const data: GalleryData = await fetchData(`${import.meta.env.VITE_API_URL}/memories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/text',
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });
      setGallery(data);
    };

    fetchGallery();
  }, []);

  return (
    <>
      {gallery?.data?.length && (
        <section className="gallery-grid" aria-label="Recent photos">
          {gallery.data.map((item: any, id: number) => {

            return (
              <Link key={id} to={`/memories/${item.title}`} className="photo-card">
                <div className="photo-top">
                  <div className="photo-badge">📸 {item.memoryContent?.length}</div>
                  <div className="photo-badge">👥</div>
                </div>
                <div className="photo-footer">{item.title}</div>

                <div className="photo-img">
                  <img src={item.memoryContent[0].filePath as string} alt={(item.memoryContent[0].description as string) || ''} width="300" height="300" />
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </>
  );
}
