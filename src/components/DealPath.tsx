import { dealPathCopy, proposal } from '../content/proposal';

export interface DealPathProps {
  variant: 'employment' | 'client';
  showScope?: boolean;
}

export default function DealPath({ variant, showScope = true }: DealPathProps) {
  const clientFirst = variant === 'client';
  const copy = dealPathCopy[variant];
  const rate = clientFirst
    ? proposal.rates.clientFirst
    : proposal.rates.employmentFirst;

  return (
    <article className={`deal-path${clientFirst ? ' deal-path--client' : ''}`}>
      <h3 className="deal-path-label">{copy.label}</h3>
      <p className="deal-rate">
        <span>{rate}</span>
        <span>%</span>
      </p>
      <p className="deal-rate-label">of collected build fees</p>
      <p className="deal-recurring">
        <strong>+ {proposal.rates.recurring}%</strong>
        <span>of collected recurring fees</span>
      </p>
      <p className="deal-description">{copy.description}</p>
      {showScope && <p className="deal-path-note">{copy.note}</p>}
    </article>
  );
}
