import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import Thumbnails from '@/components/thumbnails';
import { MemoryMimeTypes } from '@/types/accepted.file.type';
import { Memory, MemoryContent } from '@/types/gallery.type';
import { useApiFetch } from '@/utils/api.calls';

export default function EditPage() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const { fetchData, loading, error } = useApiFetch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<(File & { preview: string })[]>([]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    accept: MemoryMimeTypes,
    noClick: true,
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prevFiles) => {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const combined = [...prevFiles, ...newFiles];
        const uniqueFiles = Array.from(
          new Map(combined.map((file) => [file.name + file.size, file])).values()
        );

        return uniqueFiles;
      });
    },
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchGallery = async (): Promise<void> => {
      const data: Memory = await fetchData(`${import.meta.env.VITE_API_URL}/memories/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });
      setMemory(data);
    };

    fetchGallery();
  }, [id, fetchData]);

  const handleRemoveFile = (fileName: string) => {
    if (!memory) return;
    const updatedContent = memory.memoryContent.filter((content) => content.filePath !== fileName);

    const baseFileName = fileName.includes('?')
      ? fileName.substring(fileName.lastIndexOf('/') + 1, fileName.indexOf('?'))
      : fileName;

    setMemory({
      ...memory,
      memoryContent: updatedContent,
      deletedFiles: [...(memory.deletedFiles || []), baseFileName],
    });
  };

  const files =
    memory?.memoryContent?.map((content) => {
      return content.filePath?.toString() || '';
    }) || [];

  const thumbs = files.map((file) => (
    <Thumbnails key={file} file={file} handleRemoveFile={handleRemoveFile} />
  ));

  const handleRemoveExistingFile = (fileName: string) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const uploadedFilesThumbs = uploadedFiles.map((file, index) => (
    <Thumbnails
      key={file.name || `file-${index}`}
      file={file}
      handleRemoveFile={handleRemoveExistingFile}
    />
  ));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let updatedMemory = memory;

    if (uploadedFiles.length > 0) {
      const newFiles: MemoryContent[] = [];
      for (const file of uploadedFiles) {
        newFiles.push({
          dateCreated: new Date().toISOString(),
          filePath: '', // Leave empty or set a placeholder; the server will handle the actual file upload
          contentType: file.type,
          description: file.name,
        });
      }

      updatedMemory = {
        ...memory,
        memoryContent: [...(memory?.memoryContent || []), ...newFiles],
      } as Memory;

      setMemory(updatedMemory);
    }

    const data = new FormData();
    data.append('title', memory?.title || '');
    data.append('description', memory?.description || '');
    data.append('tags', memory?.tags?.join(', ') || '');
    data.append('familyMembers', memory?.familyMembers?.join(', ') || '');
    for (const deletedFile of memory?.deletedFiles || []) {
      data.append('deletedFiles', deletedFile);
    }
    for (const file of uploadedFiles) {
      data.append('files', file); 
    }

    const uploadedData = await fetchData(
      `${import.meta.env.VITE_API_URL}/memories/${updatedMemory?.title}?title=${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
        body: data,
      }
    );

    if (uploadedData) {
      navigate(`/memories/${updatedMemory?.title}`);
    }
  };

  return (
    <>
      <h1>Edit Page</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={memory?.title || ''}
          onChange={(e) => setMemory({ ...memory, title: e.target.value } as Memory)}
        />
        <label>Description:</label>
        <textarea
          id="description"
          name="description"
          value={memory?.description || ''}
          onChange={(e) => setMemory({ ...memory, description: e.target.value } as Memory)}
        ></textarea>
        <label>Tags (comma separated):</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={memory?.tags?.join(', ') || ''}
          onChange={(e) =>
            setMemory({ ...memory, tags: e.target.value.split(',').map((t) => t.trim()) } as Memory)
          }
        />
        <label>Family Members (comma separated):</label>
        <input
          id="familyMembers"
          type="text"
          name="familyMembers"
          value={memory?.familyMembers?.join(', ') || ''}
          onChange={(e) =>
            setMemory({
              ...memory,
              familyMembers: e.target.value.split(',').map((m) => m.trim()),
            } as Memory)
          }
        />
        <label>Existing files:</label>
        <aside className="thumbsContainer">{thumbs}</aside>
        <label>Upload new Files:</label>
        <div className="uploadContainer" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag some files here, or use the button below to upload files</p>
          )}
          <aside className="thumbsContainer">{uploadedFilesThumbs}</aside>
          <button className="button spacer" type="button" onClick={openFileDialog}>
            Open
          </button>
        </div>
        {error && <div className="error-message">{error.message}</div>}
        <button type="submit" className="button " disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="button spacer" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </>
  );
}
