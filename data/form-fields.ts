import { SERVICES } from './services';

export const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.slug, label: s.shortName })),
  { value: 'other', label: 'Something else' },
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number]['value'];

export const SITUATION_OPTIONS = [
  { value: 'starting-out', label: "I'm starting something new" },
  { value: 'ongoing', label: 'I need ongoing filing and compliance' },
  { value: 'notice', label: "I've received a notice" },
  { value: 'appeal', label: 'I have a dispute or appeal' },
  { value: 'unsure', label: "I'm not sure — I need advice" },
] as const;

export const URGENCY_OPTIONS = [
  { value: 'this-week', label: 'This week', hint: 'There is a deadline or a notice' },
  { value: 'this-month', label: 'This month', hint: 'It needs doing but is not on fire' },
  { value: 'planning', label: 'Planning ahead', hint: 'I want to get this right first' },
] as const;

export const FORM_STEPS = [
  {
    id: 'service-situation',
    order: 1,
    fields: ['service', 'situation'],
    headingKey: 'form.step1.heading',
  },
  {
    id: 'urgency',
    order: 2,
    fields: ['urgency'],
    headingKey: 'form.step2.heading',
  },
  {
    id: 'contact',
    order: 3,
    fields: ['name', 'phone', 'email'],
    headingKey: 'form.step3.heading',
  },
  {
    id: 'message-consent',
    order: 4,
    fields: ['message', 'consent'],
    headingKey: 'form.step4.heading',
  },
] as const;
