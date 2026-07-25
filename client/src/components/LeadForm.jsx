// client/src/components/LeadForm.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { LeadSchema } from '../lib/validation';
import { submitLead } from '../api';
import './LeadForm.css';

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range…' },
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
      className="lead-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Name */}
      <div className="field">
        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          type="text"
          placeholder="Jane Smith"
          className={errors.name ? 'error' : ''}
          {...register('name')}
        />
        {errors.name && (
          <span className="field-error">{errors.name.message}</span>
        )}
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="jane@company.com"
          className={errors.email ? 'error' : ''}
          {...register('email')}
        />
        {errors.email && (
          <span className="field-error">{errors.email.message}</span>
        )}
      </div>

      {/* Budget */}
      <div className="field">
        <label htmlFor="budgetRange">Budget Range</label>
        <select
          id="budgetRange"
          className={errors.budgetRange ? 'error' : ''}
          {...register('budgetRange')}
        >
          {BUDGET_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} disabled={value === ''}>
              {label}
            </option>
          ))}
        </select>
        {errors.budgetRange && (
          <span className="field-error">{errors.budgetRange.message}</span>
        )}
      </div>

      {/* Message */}
      <div className="field">
        <label htmlFor="message">Tell Us About Your Project</label>
        <textarea
          id="message"
          placeholder="Describe what you're building and how we can help…"
          className={errors.message ? 'error' : ''}
          {...register('message')}
        />
        {errors.message && (
          <span className="field-error">{errors.message.message}</span>
        )}
      </div>

      <button id="submit-lead" type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          'Send My Enquiry →'
        )}
      </button>
    </form>
  );
}
