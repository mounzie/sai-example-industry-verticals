import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as ImageCarousel } from '../components/image-carousel/ImageCarousel';
import { ComponentProps } from 'react';
import { CommonParams, CommonRendering } from './common/commonData';
import { createImageField, createLinkField } from './helpers/createFields';

type StoryProps = ComponentProps<typeof ImageCarousel>;

const meta = {
  title: 'Media/Image Carousel',
  component: ImageCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = {
  ...CommonParams,
};

const baseRendering = {
  ...CommonRendering,
  componentName: 'ImageCarousel',
  params: baseParams,
};

// No datasource: the eight built-in Kiswa slides, right to left
export const BuiltInSlides: Story = {
  render: () => <ImageCarousel params={baseParams} rendering={baseRendering} />,
};

// Authored slides from Sitecore, left to right
export const AuthoredSlides: Story = {
  render: () => (
    <ImageCarousel
      params={baseParams}
      rendering={baseRendering}
      fields={{
        Title: { value: 'Image Carousel' },
        Subtitle: { value: 'Slides picked in the Slides field of the datasource' },
        Slides: Array.from({ length: 5 }, (_, i) => ({
          id: `slide-${i + 1}`,
          name: `Slide ${i + 1}`,
          fields: {
            Image: createImageField('placeholder'),
            Caption: { value: `Slide ${i + 1}` },
            Link: i === 0 ? createLinkField('Learn more') : { value: {} },
          },
        })),
        Autoplay: { value: false },
        IntervalSeconds: { value: 5 },
        RightToLeft: { value: false },
      }}
    />
  ),
};
