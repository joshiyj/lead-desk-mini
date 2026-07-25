// client/src/components/LeadForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { LeadSchema } from '../lib/validation';
import { submitLead } from '../api';
import './LeadForm.css';

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range...' },
  { value: '<1k',    label: 'Under $1,000' },
  { value: '1k-5k',  label: '$1,000 – $5,000' },
  { value: '5k-20k', label: '$5,000 – $20,000' },
  { value: '20k+',   label: '$20,000+' },
];

export default function LeadForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LeadSchema) });

  const onSubmit = async (data) => {
    try {
      await submitLead(data);
      toast.success("Thanks! We'll be in touch soon.", { duration: 4000 });
      reset();
    } catch (err) {
      const msg = err?.message || 'Something went wrong — please try again.';
      toast.error(msg, { duration: 5000 });
    }
  };

  return (
    <form
      id="lead-form"
      className="light-lead-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Name */}
      <div className="light-field">
        <label htmlFor="name">YOUR NAME</label>
        <div className={`input-icon-wrapper ${errors.name ? 'error' : ''}`}>
          <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <input
            id="name"
            type="text"
            placeholder="Jane Smith"
            {...register('name')}
          />
        </div>
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>

      {/* Email */}
      <div className="light-field">
        <label htmlFor="email">EMAIL ADDRESS</label>
        <div className={`input-icon-wrapper ${errors.email ? 'error' : ''}`}>
          <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="email"
            type="email"
            placeholder="jane@company.com"
            {...register('email')}
          />
        </div>
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      {/* Budget */}
      <div className="light-field">
        <label htmlFor="budgetRange">BUDGET RANGE</label>
        <div className={`input-icon-wrapper ${errors.budgetRange ? 'error' : ''}`}>
          <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <select id="budgetRange" {...register('budgetRange')}>
            {BUDGET_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} disabled={value === ''}>
                {label}
              </option>
            ))}
          </select>
          <svg className="select-chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {errors.budgetRange && <span className="field-error">{errors.budgetRange.message}</span>}
      </div>

      {/* Message */}
      <div className="light-field">
        <label htmlFor="message">TELL US ABOUT YOUR PROJECT</label>
        <div className={`input-icon-wrapper textarea-wrapper ${errors.message ? 'error' : ''}`}>
          <svg className="input-icon textarea-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <textarea
            id="message"
            placeholder="Describe what you're building and how we can help..."
            {...register('message')}
          />
        </div>
        {errors.message && <span className="field-error">{errors.message.message}</span>}
      </div>

      <button id="submit-lead" type="submit" className="light-form-btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="light-form-spinner" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          'Send My Enquiry →'
        )}
      </button>
    </form>
  );
}
