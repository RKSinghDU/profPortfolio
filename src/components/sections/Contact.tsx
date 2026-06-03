import { Mail, MapPin, Send } from 'lucide-react';
import { SITE } from '../../content/siteConfig';
import { useContactForm } from '../../hooks/useContactForm';
import { SectionHeader } from '../common/SectionHeader';
import { sectionContainer } from '../../styles/classNames';

export function Contact() {
  const { data, submitting, status, handleChange, handleSubmit } = useContactForm();

  return (
    <section id="contact" className={sectionContainer}>
      <SectionHeader
        eyebrowText="Contact"
        title="Get in touch."
        description="I welcome correspondence from students, researchers, academic collaborators, and organizations interested in consulting or advisory work."
      />

      <div className="grid md:grid-cols-2 gap-10 mt-8">
        <div>
          {status === 'success' && (
            <div className="mb-4 px-4 py-3 rounded-md bg-[var(--ok-bg)] text-[var(--ok-fg)] text-sm">
              Message sent successfully — I&rsquo;ll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 px-4 py-3 rounded-md bg-[var(--err-bg)] text-[var(--accent-deep)] text-sm">
              Could not send — please try again, or email me directly.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              type="text"
              name="from_name"
              placeholder="Your Name"
              value={data.from_name}
              onChange={handleChange}
            />
            <TextField
              type="email"
              name="from_email"
              placeholder="Your Email"
              value={data.from_email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={data.message}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[var(--line-input)] bg-[var(--surface)] px-4 py-3 text-[var(--heading)] placeholder-[var(--placeholder)] focus:outline-none focus:border-[var(--accent)] resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-sm text-[var(--bg)] text-[0.9rem] font-medium transition-colors ${
                submitting
                  ? 'bg-[var(--disabled)] cursor-not-allowed'
                  : 'bg-[var(--accent)] hover:bg-[var(--accent-deep)]'
              }`}
            >
              {submitting ? 'Sending…' : <>Send Message <Send size={15} /></>}
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <ContactDetail icon={<Mail size={18} />} label="Email">
            <a
              href={`mailto:${SITE.email}`}
              className="text-[var(--heading)] hover:text-[var(--accent)] transition-colors"
            >
              {SITE.email}
            </a>
          </ContactDetail>
          <ContactDetail icon={<MapPin size={18} />} label="Office">
            <p className="text-[var(--body)]">{SITE.affiliationFull}</p>
          </ContactDetail>
        </div>
      </div>
    </section>
  );
}

interface TextFieldProps {
  type: 'text' | 'email';
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function TextField({ type, name, placeholder, value, onChange }: TextFieldProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-md border border-[var(--line-input)] bg-[var(--surface)] px-4 py-3 text-[var(--heading)] placeholder-[var(--placeholder)] focus:outline-none focus:border-[var(--accent)]"
    />
  );
}

interface ContactDetailProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function ContactDetail({ icon, label, children }: ContactDetailProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[var(--accent)] mt-1">{icon}</span>
      <div>
        <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--accent)]">{label}</div>
        {children}
      </div>
    </div>
  );
}
