import React, { JSX } from 'react';
import clsx from 'clsx';
import { IaIcon } from './IaIcon';

type Props = {
  pages: number;
  page: number;
  goTo: (index: number) => void;
  prev: () => void;
  next: () => void;
  previousLabel: string;
  nextLabel: string;
};

/** Arrows on one side and page dots on the other, as under ia.gov.sa's service cards */
export const IaCarouselControls = ({
  pages,
  page,
  goTo,
  prev,
  next,
  previousLabel,
  nextLabel,
}: Props): JSX.Element | null => {
  if (pages < 2) return null;
  return (
    <div className="ia-carousel__controls">
      <div className="ia-carousel__arrows">
        <button
          type="button"
          className="ia-round-btn"
          aria-label={previousLabel}
          disabled={page === 0}
          onClick={prev}
        >
          <IaIcon name="chevronLeft" size={20} strokeWidth={2} className="ia-flip-rtl" />
        </button>
        <button
          type="button"
          className="ia-round-btn"
          aria-label={nextLabel}
          disabled={page >= pages - 1}
          onClick={next}
        >
          <IaIcon name="chevronRight" size={20} strokeWidth={2} className="ia-flip-rtl" />
        </button>
      </div>
      <div className="ia-carousel__dots">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={clsx('ia-carousel__dot', i === page && 'is-active')}
            aria-label={`${i + 1} / ${pages}`}
            aria-current={i === page}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};
