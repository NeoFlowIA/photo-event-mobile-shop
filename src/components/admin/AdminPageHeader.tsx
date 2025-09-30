import { ReactNode } from 'react';

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const AdminPageHeader = ({ eyebrow, title, description, actions, children }: AdminPageHeaderProps) => {
  const sectionId = slugify(title);

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white/80 px-6 py-6 shadow-sm backdrop-blur transition-colors"
      aria-labelledby={sectionId}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 md:max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">{eyebrow}</p>
          )}
          <div>
            <h2 id={sectionId} className="text-2xl font-semibold text-slate-900">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
          </div>
          {children && <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">{children}</div>}
        </div>
        {actions && <div className="w-full md:w-auto">{actions}</div>}
      </div>
    </section>
  );
};

export default AdminPageHeader;
