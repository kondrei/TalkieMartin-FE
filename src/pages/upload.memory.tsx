import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { MemoryMimeTypes } from '@/types/accepted.file.type';
import { useApiFetch } from '@/utils/api.calls';

import '../css/upload.css';

import Thumbnails from '@/components/thumbnails';

export default function UploadMemoryPage() {
  const navigate = useNavigate();
  const { fetchData, loading, error } = useApiFetch();
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    accept: MemoryMimeTypes,
    noClick: true,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const combined = [...prevFiles, ...newFiles];
        const uniqueFiles = Array.from(
          new Map(combined.map((file) => [file.name + file.size, file])).values()
        );

        setFormData({ ...formData, files: Array.from(uniqueFiles || []) });
        return uniqueFiles;
      });
    },
  });

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: prevFormData.files.filter((file) => file.name !== fileName),
    }));
  };

  const thumbs = files.map((file) => (
    <Thumbnails key={file.name} file={file} handleRemoveFile={handleRemoveFile} />
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    familyMembers: '',
    files: [] as File[],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
        <label>Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
        <label>Tags (comma separated):</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <label>Family Members (comma separated):</label>
        <input
          id="familyMembers"
          type="text"
          name="familyMembers"
          value={formData.familyMembers}
          onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
        />
        <label>Upload Files:</label>
        <div className="uploadContainer" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag some files here, or use the button below to upload files</p>
          )}
          <aside className="thumbsContainer">{thumbs}</aside>
          <button className="button spacer" type="button" onClick={openFileDialog}>
            Open
          </button>
        </div>
        {error && <div className="error-message">{error.message}</div>}
        <button type="submit" className="button " disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Memory'}
        </button>
      </form>
    </div>
  );
}