import TopBar from '@/components/top-bar';

import '../css/error.css';

import { HomePage } from './Home.page';

export default function ErrorPage({
  errorCode = 404,
  message = 'The page you are looking for does not exist.',
  homeWrap = true,
}: {
  errorCode?: number;
  message?: string;
  homeWrap?: boolean;
}) {
  const content = (
    <div className="error-page">
      <h1 className="title">{errorCode}</h1>
      <p>{message}</p>
    </div>
  );

  return homeWrap ? <HomePage>{content}</HomePage> : content;
}