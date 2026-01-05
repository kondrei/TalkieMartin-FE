import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiFetch } from '@/utils/api.calls';

export default function UploadMemoryPage() {
  const navigate = useNavigate();
  const { fetchData, loading, error } = useApiFetch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    familyMembers: '',
    files: [] as File[],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form Data:', formData);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);
    data.append('familyMembers', formData.familyMembers);

    for (const file of formData.files) {
      data.append('files', file);
    }

    const uploadedData = await fetchData(`${import.meta.env.VITE_API_URL}/memories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: data,
    });
    console.log('🚀 ~ handleSubmit ~ uploadedData:', uploadedData);

    if (uploadedData) {
      navigate(`/memories/${uploadedData?.title}`);
    }
  };

  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <br />
        <label>Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <br />
        <label>Tags (comma separated):</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <br />
        <label>Family Members (comma separated):</label>
        <input
          id="familyMembers"
          type="text"
          name="familyMembers"
          value={formData.familyMembers}
          onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
        />
        <br />
        <label>Upload Files:</label>
        <input
          type="file"
          name="files"
          multiple
          onChange={(e) => setFormData({ ...formData, files: Array.from(e.target.files || []) })}
        />
        <br />
        {error && <div className="error-message">{error.message}</div>}
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Memory'}
        </button>
      </form>
    </div>
  );
}
