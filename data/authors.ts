// Populated from BRAND-FACTS.md section 2. Author identity is an E-E-A-T signal for
// financial content — an article attributed to 'TBD' should not be published.

export interface Author {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  avatar: string | null;
  linkedin: string;
  url: string;
}

export const AUTHORS: Record<string, Author> = {
  principal: {
    id: 'principal',
    name: 'TBD',
    role: 'TBD',
    credentials: 'TBD',
    bio: 'TBD',
    avatar: null,
    linkedin: 'TBD',
    url: '/practice/principal',
  },
};

export function isAuthorComplete(id: string): boolean {
  const author = AUTHORS[id];
  if (!author) return false;
  return !Object.values(author).some((v) => v === 'TBD');
}
