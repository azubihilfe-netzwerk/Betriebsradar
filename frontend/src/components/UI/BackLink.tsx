import { LinkButton } from '../Form/Button';

interface BackLinkProps {
  to: string;
}

export default function BackLink({ to }: BackLinkProps) {
  return (
    <LinkButton to={to} variant="secondary" size="sm">
      ← Zurück
    </LinkButton>
  );
}
