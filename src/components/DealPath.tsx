import { proposal } from '../content/proposal';
export interface DealPathProps {
  variant: 'employment' | 'client';
}
export default function DealPath({ variant }: DealPathProps) {
  const early = variant === 'employment';
  return (
    <article
      className={`deal-path ${early ? 'employment-path' : 'client-path'}`}
    >
      <div className="path-top">
        <span>{early ? 'Employment first' : 'Client first'}</span>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={early ? 'M7 24V6h16v18M7 15h16' : 'm4 19 11-13 11 13M9 24h12'}
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      </div>
      <div className="path-rate">
        <span>
          {early ? proposal.rates.employmentFirst : proposal.rates.clientFirst}
        </span>
        <span className="percent">%</span>
      </div>
      <p className="rate-caption">of collected build fees</p>
      <div className="recurring-rate">
        <strong>+ {proposal.rates.recurring}%</strong>
        <span>of collected recurring fees</span>
      </div>
      <h3>{early ? 'Start with a commitment.' : 'Start with a customer.'}</h3>
      <p>
        {early
          ? `Begin employment before a qualifying sale, any time in the ${proposal.activationDays}-day window.`
          : 'Bring a registered, credited and approved full-build customer first. Both signatures and the first cleared payment activate this path.'}
      </p>
      <p className="path-note">
        {early
          ? 'The lower build rate follows the employment-first path.'
          : `The ${proposal.rates.clientFirst}% build rate applies to the triggering sale and all future credited sales.`}
      </p>
    </article>
  );
}
