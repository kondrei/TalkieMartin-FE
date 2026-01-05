import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiFetch } from '@/utils/api.calls';

import '../css/Login.page.css';

export default function Login({ message }: { message?: string }) {
  const { fetchData, loading, error } = useApiFetch();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const errors = { email: '', password: '' };

    if (!/^\S+@\S+$/.test(values.email)) {
      errors.email = 'Invalid email';
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {return;}

    const data = await fetchData(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    if (data) {
      localStorage.setItem('authToken', data.access_token);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      {message && <div className="login-message">{message}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            className={validationErrors.email ? 'input-error' : ''}
          />
          {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={values.password}
            title="Please add valid email"
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            className={validationErrors.password ? 'input-error' : ''}
          />
          {validationErrors.password && (
            <span className="error-text">{validationErrors.password}</span>
          )}
        </div>

        {error && <div className="error-message">{error.message}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="button">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
