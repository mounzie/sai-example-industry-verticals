import React, { JSX } from 'react';
import { Text as ContentSdkText, TextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Kicker: TextField;
  Status: TextField;
  Title: TextField;
  Subtitle: TextField;
  FirstTimeLabel: TextField;
  FirstTime: TextField;
  SecondTimeLabel: TextField;
  SecondTime: TextField;
}

export type SmcUpNextProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: SmcUpNextProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;

  if (!fields) {
    return (
      <div className={`component smc-up-next ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">SMC Up Next</span>
      </div>
    );
  }

  return (
    <div className={`component smc-home smc-up-next ${styles ?? ''}`} id={id}>
      <div className="smc-home__wrap">
        <div className="smc-card smc-up-next__card">
          <div className="smc-row smc-row--between">
            <ContentSdkText tag="div" className="smc-kicker" field={fields.Kicker} />
            <ContentSdkText tag="div" className="smc-chip" field={fields.Status} />
          </div>
          <ContentSdkText tag="h3" className="smc-up-next__title" field={fields.Title} />
          <ContentSdkText tag="div" className="smc-muted smc-small" field={fields.Subtitle} />
          <div className="smc-sep" />
          <div className="smc-up-next__times">
            <div>
              <ContentSdkText tag="div" className="smc-label" field={fields.FirstTimeLabel} />
              <ContentSdkText tag="div" className="smc-up-next__time" field={fields.FirstTime} />
            </div>
            <div>
              <ContentSdkText tag="div" className="smc-label" field={fields.SecondTimeLabel} />
              <ContentSdkText
                tag="div"
                className="smc-up-next__time smc-up-next__time--accent"
                field={fields.SecondTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
