import React, { JSX } from 'react';
import {
  Field,
  Link as ContentSdkLink,
  LinkField,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useIaLabels } from '../non-sitecore/iaShared';

interface Fields {
  Title: Field<string>;
  Intro: Field<string>;
  FirstValue: Field<string>;
  FirstLabel: Field<string>;
  SecondValue: Field<string>;
  SecondLabel: Field<string>;
  ThirdValue: Field<string>;
  ThirdLabel: Field<string>;
  FourthValue: Field<string>;
  FourthLabel: Field<string>;
  ViewAllLink: LinkField;
}

export type IaStatsProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: IaStatsProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { fields } = props;
  const { label, isEditing } = useIaLabels();

  if (!fields) {
    return (
      <div className={`component ia ia-stats ${styles ?? ''}`} id={id}>
        <span className="is-empty-hint">IA Stats</span>
      </div>
    );
  }

  const stats = [
    [fields.FirstValue, fields.FirstLabel],
    [fields.SecondValue, fields.SecondLabel],
    [fields.ThirdValue, fields.ThirdLabel],
    [fields.FourthValue, fields.FourthLabel],
  ];

  return (
    <section className={`component ia ia-section ia-stats ${styles ?? ''}`} id={id}>
      <div className="ia-wrap">
        <div className="ia-section__head">
          <div>
            <ContentSdkText tag="h2" className="ia-section__title" field={fields.Title} />
            <ContentSdkText tag="p" className="ia-section__intro" field={fields.Intro} />
          </div>
          {(fields.ViewAllLink?.value?.href || isEditing) && (
            <ContentSdkLink field={fields.ViewAllLink} className="ia-link-arrow">
              {!isEditing && label('ia_view_all')}
            </ContentSdkLink>
          )}
        </div>
        <div className="ia-stats__grid">
          {stats.map(([value, name], i) => (
            <div key={i} className="ia-card ia-stats__item">
              <ContentSdkText tag="div" className="ia-stats__value" field={value} />
              <ContentSdkText tag="div" className="ia-stats__label" field={name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
